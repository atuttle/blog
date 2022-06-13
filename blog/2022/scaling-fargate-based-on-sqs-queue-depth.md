---
title: Scaling Fargate Based On SQS Queue Depth
desc: My method doesn't use SNS or Lambda.
img: /img/2022/queue-scaling.png
date: 2022-06-13
tags:
  - aws
  - sqs
  - cloudwatch
---

Something I've talked about a fair amount on the [Working Code Podcast](https://workingcode.dev) recently has been a project where I needed to take some work that was being initiated by API requests and run in the foreground, and move those off-server and ideally queue them up so that we never have to worry about two tasks fighting over resources or, worse, deadlocking. I initially planned to follow [the approach laid out by Murali Allada](https://www.blog.muraliallada.com/fargate-scaling/), and in some ways I did, but what we ended up doing reduced the number of steps and made it feel less like a rube-goldberg machine.

His approach involved using a CloudWatch alarm to trigger an SNS message, that would start a Lambda function, which would call the AWS API to scale your Fargate containers as needed. It presumably works for him, but the number of hand-offs does make me worry that it's a bit fragile.

My approach[^1] gets rid of the SNS message and the Lambda function, and directly scales Fargate from the CloudWatch alarm. This may not have been possible back in June of 2020 when Murali wrote his article &ndash; which goes to show how AWS is always changing and improving.

![A flow chart showing SQS flowing into CloudWatch Alarms, which flows into SNS, which flows into Lambda, which flows into Fargate; but SNS and Lambda have been scratched out with a big squiggly line.](/img/2022/queue-scaling.png)

## Not all rainbows and lollipops

One thing that I'm not particularly happy about with this configuration is that it sometimes takes 15+ minutes after a long period of queue dormancy for CloudWatch to notice that there are items in the queue. If you're a regular user of CloudWatch, some lag will not be a surprise to you. I believe that in their docs they promise a max of something like 15 minutes from the time the item is added to the queue until the time that CloudWatch is aware of it. While not ideal, this is _acceptable_ for our needs. Remember that this only applies because our queue will lie dormant for most of the day, so it seems like CloudWatch stops paying close attention to it. If your queue will be in more or less constant usage, this might not be a problem for you.

An alternative approach if you would experience this lag but don't want to wait 15+ minutes for queue work to start processing would be to have SQS directly trigger a Lambda, and in your Lambda do the inspections and math to determine if you need to scale up or scale down. With this approach you're taking control over something that AWS can do for you, so you get extra control but you're also responsible for keeping it working.

## How to create the infrastructure

The first thing you need is an SQS queue that you want to monitor, and a Fargate service that you want to scale based on your queue's depth (item count).

From there, you need to create at least two CloudWatch Alarms. I started by creating them manually in the AWS console using [click-ops](https://www.lastweekinaws.com/blog/clickops/). Depending on what you expect your typical queue usage to be you might need to alter the values I'll provide here, but for my project I expect the queue to be empty most of the time, and then in the early morning a bunch of tasks will be pushed into it. Once the work is complete, the queue will be going dormant again until the next morning.

So I need an alarm that detects we've transitioned from zero to one-or-more items in the queue so that I can scale my Fargate instance from 0 desired instances to 1; and I need another alarm to detect that the work is done and scale Fargate back down to 0 desired instances.

The first one is pretty straight forward.

- Select your queue
- Monitor the metric `ApproximateNumberOfMessagesVisible`
- Statistic: `minimum`
- Period: 1 minute
- Threshold
  - Type: Static
  - Condition: `Greater/Equal`
  - Value: `1`
- Datapoints to alarm: `1` out of `1`
- Treat missing data as missing

This alarm will trigger the moment it sees anything appear in the queue. We'll circle back to hooking it up to Fargate later.

Next we need an alarm that will determine that work is done and it can scale Fargate back down to 0 desired instances. We can't simply rely on there being 0 items in the SQS queue, because each task from the queue takes a certain amount of time to complete. If your alarm scales down your Fargate worker before it's able to get the work done, then the job will never complete. I'm not sure which is worse: if the failure to complete causes the item to reappear in the queue and start the process over again, only to be shutdown prematurely every time, eventually landing in your Dead Letter Queue; or if you were to delete the item from the queue immediately and then get shutdown prematurely then the job would never complete and never be retried. Either way is pretty bad.

So what you need to decide is how much time needs to pass from the moment that the task is received from the SQS Queue (leaving the queue now empty) until you can be sure that the job has completed. For argument's sake, let's say 10 minutes. So you need to create an alarm that triggers after the queue has been empty for 10 minutes.

- Select your queue
- Monitor the metric `ApproximateNumberOfMessagesVisible`
- Statistic: `maximum`
- Period: 1 minute
- Threshold
  - Type: Static
  - Condition: `Lower/Equal`
  - Value: `0`
- Datapoints to alarm: `10` out of `10`
- Treat missing data as missing

With this alarm, if a new item appears in the queue after 8 minutes then the countdown will have to restart after that new queue item has been removed.

From here, you can start hooking your alarms up to your Fargate services. You can select them in the auto-scaling section of the service wizard (again with the click-ops).

This works great as long as you don't need to publish a new version of your task runner. For some strange reason, when I uploaded a new container to ECR and deployed it for my service, the alarm would be removed. Not very helpful!

So this forced my hand to step back from click-ops, which is probably a good thing, and to build some automation around these deploys. I'm going to consider the ECR and ECS changes out-of-scope for this (already quite long) article, and only show you the additional steps I had to take to reconnect the alarms and Fargate services.

For [belt-and-suspenders](https://www.merriam-webster.com/dictionary/belt-and-suspenders) reasons I decided to recreate the Alarms, Scaling Policies, and Scalable Targets for every deploy. The all overwrite if existing, so there's no harm and it simplifies everything a bit.

If you know me, you know that I am a big fan of Makefiles, so here's the commands from my Makefile:

1. First, the scalable target:

```bash
@aws application-autoscaling register-scalable-target --service-namespace ecs --scalable-dimension ecs:service:DesiredCount --resource-id service/YOUR-CLUSTER-NAME/YOUR-SERVICE-NAME --min-capacity 0 --max-capacity 1
```

2. Then, the scaling policies:

```bash
@aws application-autoscaling put-scaling-policy --service-namespace ecs --scalable-dimension ecs:service:DesiredCount --resource-id service/YOUR-CLUSTER-NAME/YOUR-SERVICE-NAME --policy-name scale-out --policy-type StepScaling --step-scaling-policy-configuration file://`pwd`/aws/scaling-policies/scale-out.json > /dev/null

@aws application-autoscaling put-scaling-policy --service-namespace ecs --scalable-dimension ecs:service:DesiredCount --resource-id service/YOUR-CLUSTER-NAME/YOUR-SERVICE-NAME --policy-name scale-in --policy-type StepScaling --step-scaling-policy-configuration file://`pwd`/aws/scaling-policies/scale-in.json > /dev/null
```

The policies use input files that are located relative to the Makefile at `aws/scaling-policies/...`. Here's an example of the `scale-out.json` file:

```json
{
	"AdjustmentType": "ExactCapacity",
	"Cooldown": 300,
	"MetricAggregationType": "Minimum",
	"StepAdjustments": [
		{
			"MetricIntervalLowerBound": 0.0,
			"MetricIntervalUpperBound": 5.0,
			"ScalingAdjustment": 1
		},
		{
			"MetricIntervalLowerBound": 5.0,
			"ScalingAdjustment": 2
		}
	]
}
```

This file is more complex than the scaling steps I described above. It will scale to 1 instance from 0 to 5 items in the queue, but if more than 5 items are in the queue it will scale up to 2 desired instances of the service.

3. Next we need to (re)create the alarms, and tell them to use the ARNs of the scaling policies we just created.

```bash
@aws cloudwatch put-metric-alarm --alarm-actions $$(aws application-autoscaling describe-scaling-policies --service-namespace ecs --query 'ScalingPolicies[?PolicyName==`scale-out`].PolicyARN' --output text) --cli-input-json file://`pwd`/aws/alarms/queue.json

@aws cloudwatch put-metric-alarm --alarm-actions $$(aws application-autoscaling describe-scaling-policies --service-namespace ecs --query 'ScalingPolicies[?PolicyName==`scale-in`].PolicyARN' --output text) --cli-input-json file://`pwd`/aws/alarms/dequeue.json
```

Here again, we're also passing in some JSON files to specify most of the attributes of our alarms. Here's a sample of `queue.json`:

```json
{
	"AlarmName": "warehouse-queue",
	"ActionsEnabled": true,
	"OKActions": [],
	"InsufficientDataActions": [],
	"MetricName": "ApproximateNumberOfMessagesVisible",
	"Namespace": "AWS/SQS",
	"Statistic": "Minimum",
	"Dimensions": [
		{
			"Name": "QueueName",
			"Value": "warehouse-queue"
		}
	],
	"Period": 60,
	"EvaluationPeriods": 1,
	"DatapointsToAlarm": 1,
	"Threshold": 1.0,
	"ComparisonOperator": "GreaterThanOrEqualToThreshold",
	"TreatMissingData": "missing"
}
```

We run these 3 updates (scalable target, scaling policy, alarm) after every deploy of the worker containers. They only add a few seconds, and it guarantees that everything is still wired correctly. More importantly, it doesn't require a human to click around in the console and hope they got it right.

[^1]: Hat tip to my teammate Crump for the idea!

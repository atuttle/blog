---
layout: layouts/home.njk
discuss: false
eleventyExcludeFromCollections: true
---

<!-- <link href="/css/jsdiff/assets/css/bootstrap.min.css" rel="stylesheet" /> -->
<!-- <link href="/css/jsdiff/assets/css/bootstrap-theme.min.css" rel="stylesheet" /> -->

<style>
	#inputs,
	#submit,
	#result {
		margin-top: 20px;
	}
	#result {
		font-family: "Consolas", monospace;
		font-size: 1.6em;
	}
	del {
		background: #ffe6e6;
		padding: 2px;
	}
	ins {
		background: #e6ffe6;
		padding: 2px;
	}
</style>

<div class="row">
	<div class="col-xs-12">
		A non-hideous implementation of
		<a href="http://ejohn.org/projects/javascript-diff-algorithm/"
			>John Resig's JSDiff library</a
		>.
	</div>
</div>

<div class="row" id="inputs">
<div class="col-xs-6">
<textarea rows="10" class="form-control" id="left">The red brown fox jumped over the rolling log.</textarea>
</div>
<div class="col-xs-6">
<textarea rows="10" class="form-control" id="right">The brown spotted fox leaped over the rolling log</textarea>
</div>
</div>

<div class="col-xs-6 col-xs-offset-3">
	<label><input type="checkbox" id="isCode" value="1" checked="checked" />
		I'm comparing code, preserve my linebreaks!
	</label>
</div>
<div class="row">
<div class="col-xs-12">
	<button
		type="button"
		class="form-control btn btn-warning"
		id="submit"
	>
		<span class="glyphicon glyphicon-fire"></span> Diff
	</button>
</div>
</div>

<div class="row">
<div class="col-xs-12" id="result"></div>
</div>

</div>
<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="/css/jsdiff/assets/js/bootstrap.min.js"></script>
<script src="/css/jsdiff/assets/js/jsdiff.js"></script>
<script>
$(function () {
	$("#submit").on("click", function () {
		var pre = $("#isCode").prop("checked");
		if (pre) {
			$("#result").html(
				"<pre>" +
					diffString($("#left").val(), $("#right").val()) +
					"</pre>"
			);
		} else {
			$("#result").html(diffString($("#left").val(), $("#right").val()));
		}
	});
});
</script>
<script>
(function (i, s, o, g, r, a, m) {
	i["GoogleAnalyticsObject"] = r;
	(i[r] =
		i[r] ||
		function () {
			(i[r].q = i[r].q || []).push(arguments);
		}),
		(i[r].l = 1 * new Date());
	(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m);
})(
	window,
	document,
	"script",
	"//www.google-analytics.com/analytics.js",
	"ga"
);
ga("create", "UA-2284831-6", "fusiongrokker.com");
ga("send", "pageview");
</script>

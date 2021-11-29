---
title: React Hooks Cheat Sheet
desc: Notes summarizing what I've learned about the core React hooks.
img: /img/2020/vishal-jadhav-xBmmFz2psKw-unsplash.jpg
date: 2020-10-23
tags:
  - react.js
templateEngineOverride: md #avoids liquid/nunjucks parse errors in the react code samples
---

I just finished watching [this excellent video series on Egghead][1]. I found that it really simplified a lot of the hard parts of `useEffect` and also explained a few of the other hooks that I haven't taken the time to learn yet. I was so impressed by it that I was inspired to write down an even shorter version for later reference to help reinforce the lessons, and also to share with you. If any of this feels like there's not enough detail for you, I would highly encourage you to check out [the videos on egghead][1], where Ryan goes into more detail and gives examples for each.

## useState

I'm not going to cover `useState` because that's out of scope for what I want to accomplish here, but it is a pre-requisite for understanding what's below. If that one doesn't make sense to you already, you won't understand the rest of these.

## useEffect

useEffect has three different usage modes, and is used to synchronize React with anything that React doesn't control; from the page title to making AJAX requests or dealing with device api's (like getUserMedia).

1. No 2nd argument: Executes on every render.

```js
useEffect(() => {
	document.title = `${new Date().toLocaleString()}`;
});
```

2. Array of variables as 2nd argument: Executes any time any of those variables change.

```js
useEffect(() => {
	/* there's a new value for someData */
}, [someData]);
```

3. Empty array as 2nd argument: Executes only on FIRST render, and never again until page refresh.

```js
useEffect(() => {
	window.addEventListener('resize', () => {});
}, []);
```

In this case, I'm attaching an event listener to the window's resize event, and if I re-run that every time the component re-renders, I'll be attaching a new listener every time, effectively calling my listener potentially hundreds or thousands of times every time the event occurs.

If your effect creates something that needs to be cleaned up when the component is removed (like removing created event listeners), the effect should return a function that does that cleanup work, and React will run it only when the cleanup is needed. Since that's exactly what I did in the last code block above, let's fix it to be correct here:

```js
useEffect(() => {
	window.addEventListener('resize', handleResize);
	return () => {
		window.removeEventListener('resize', handleResize);
	};
}, []);
```

## useRef

_Not just for persisting a reference to an input element!_

`useRef` can be treated similarly to `useState`, except that it doesn't trigger a re-render. If your render function displays the ref value, the rendered content won't be updated when the ref is updated, but if something triggers a re-render then the latest value from the ref is available to the render function. You can use this to track data changes in a more performant way, as long as you don't need those changes to be re-rendered.

## useMemo

Memoization is caching the results of a pure function, which can be helpful if that function requires intensive or long-running calculations. While implementing memoization is a simple and well understood pattern, `useMemo` combines that with the API of useEffect so that it only ever runs if the input values change.

```js
//not only will useMemo cache the results for the current value of lotsOfData
//but it will also ONLY run on the first render or after lotsOfData changes
const intenseMath = () => 42;
const usefulData = useMemo(() => {
	return intenseMath(lotsOfData);
}, [lotsOfData]);
```

## useCallback

Whereas `useMemo` returns a memoized value, `useCallback` returns a memoized function. When you want to be able to pass the memoized callback function around as a property, use `useCallback` instead. Via closure this helps you expose functionality without exposing internal state.

## useLayoutEffect

`useLayoutEffect` is different from `useEffect` in that it runs _before_ the DOM paints. This allows you to make changes that will affect what your app looks like (positioning elements, for example), without causing the screen to flash with a repaint because you moved something immediately after it was painted.

## useContext

Contexts have been around for a while now as a useful way to work around prop drilling. `useContext` makes it simple to create and access contexts wherever you need them.

Creating and applying the provider:

```js
export const FooContext = React.createContext();

function FooComponent() {
	return (
		<FooContext.Provider value={{ data, setSomething }}>
			<Foo />
		</FooContext.Provider>
	);
}
```

Using properties of the context elsewhere:

```js
import { FooContext } from './FooComponent';

function SomeFooChild() {
	const context = useContext(FooContext);
	return <div>{context.data}</div>;
}
```

## useReducer

This one is like a mashup of `useState` and [Redux][2]. You dispatch actions that are all handled by a single (composable if you want) reducer, to update a state object containing multiple values. Generally considered a best practice not to group values that aren't related. For example, groupe the state for inputs in a form.

```js
const [state, dispatch] = useReducer(reducer, initialValue);

const reducer = (state, { type, value }) => {
	switch (type) {
		case 'foo':
			return {
				...state
				//plus whatever changes are indicated by
				//type=foo and the associated value
			};
		default:
			return state;
	}
};

//to dispatch an event:
dispatch({ type: 'foo', value: 42 });
```

## useDebugValue

Lastly, `useDebugValue` allows you to highlight something in the [React Dev Tools][3] **from inside a custom hook**. Think of it like `console.log` but better. When your debug value is large or complex, you can improve app performance by passing a 2nd argument to useDebugValue. The 2nd argument is a function and is used to format the value. This can be a performance benefit because the format function is only called if the value is inspected in the dev tools.

```js
useDebugValue(myState, (s) => JSON.stringify(s));
```

This shows up in the devtools as a key-value pair, and the key name is the name of your custom hook.

## Wrapping Up

As I mentioned at the top, this was a heavily summarized version of what I learned from Ryan Harris' egghead course, [React Hooks: Revisited][1]. Thanks to Ryan for a fantastic quick video course and his simple and clear explanations!

[1]: https://egghead.io/playlists/react-hooks-revisited-abce
[2]: https://github.com/reduxjs/redux
[3]: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
[4]: https://reactjs.org/docs/hooks-reference.html#defer-formatting-debug-values

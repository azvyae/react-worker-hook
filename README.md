# React Worker Hook - Web Worker Utilities for ReactJS

This package allows you to utilize [Web Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) with simple setup as using this custom React hook.

**Inspired by [alewin/useWorker](https://github.com/alewin/useWorker)**

This React hook supports typescript and also limits maximum of 1 instance of a running worker. 

Add the package to your React app:

```bash
npm install react-worker-hook
```

## How to use

1. First you should import the worker function

```jsx
import { useWorker } from "react-worker-hook";
```

2. Pass a function that will be run inside the worker to the hook

```jsx
const dispatchWorker = useWorker((payload) => {
  console.info(payload); // from main instance
  for (let i = 0; i < 100000; i++) {
    console.log(i)
  }
  return "from worker instance";
});
```

3. Then you can define a non blocking function (promise) like this

```jsx
async function runWorker() {
  const result = 
    await dispatchWorker("from main instance");
  console.log(result); // from worker instance
}
```

## Future Release

- Will add SharedWorker hook so it can share same memory buffer between main and worker instance
- Worker options
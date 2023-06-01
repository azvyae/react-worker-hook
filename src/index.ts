import { useMemo, useState } from "react";

type Constraints<C> = Exclude<
	C,
	| Function
	| PropertyDescriptor
	| Document
	| Omit<RegExp, "lastIndex">
	| React.JSX.Element
	| React.JSX.Element[]
	| void
>;

type Parameter<T extends (arg: any) => any> = T extends (args: infer P) => any
	? P
	: never;

type WorkerFunction<
	T extends (arg: Constraints<Parameter<T>>) => Constraints<ReturnType<T>>
> = T & {
	(arg: Constraints<Parameter<T>>): Constraints<ReturnType<T>>;
	(...args: never): Constraints<ReturnType<T>>;
};

export function useWorker<F extends (arg: any) => any>(fn: WorkerFunction<F>) {
	const [active, setActive] = useState(false);

	const workerCode = `
    self.onmessage = function (e) {
      const runner = ${fn}
      self.postMessage(runner(e.data));
    };
  `;
	const url = useMemo(
		() =>
			URL.createObjectURL(new Blob([workerCode], { type: "text/javascript" })),
		[workerCode]
	);

	return async (payload: Parameter<F>) => {
		if (typeof payload === "function" || typeof payload === "symbol") {
			throw Error("Invalid payload type");
		}

		const result: ReturnType<F> = await new Promise((resolve) => {
			if (!active) {
				setActive(true);
				const worker = new Worker(url, { type: "module" });
				worker.postMessage(payload ? payload : true);
				worker.onmessage = (e) => {
					resolve(e.data);
					worker.terminate();
					setActive(false);
				};
			}
		});

		return result;
	};
}

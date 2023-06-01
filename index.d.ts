/// <reference types="react" />
type Constraints<C> = Exclude<C, Function | PropertyDescriptor | Document | Omit<RegExp, "lastIndex"> | React.JSX.Element | React.JSX.Element[] | void>;
type Parameter<T extends (arg: any) => any> = T extends (args: infer P) => any ? P : never;
type WorkerFunction<T extends (arg: Constraints<Parameter<T>>) => Constraints<ReturnType<T>>> = T & {
    (arg: Constraints<Parameter<T>>): Constraints<ReturnType<T>>;
    (...args: never): Constraints<ReturnType<T>>;
};
export declare function useWorker<F extends (arg: any) => any>(fn: WorkerFunction<F>): (payload: Parameter<F>) => Promise<ReturnType<F>>;
export {};

import { useMemo, useState } from "react";
export function useWorker(fn) {
    const [active, setActive] = useState(false);
    const workerCode = `
    self.onmessage = function (e) {
      const runner = ${fn}
      self.postMessage(runner(e.data));
    };
  `;
    const url = useMemo(() => URL.createObjectURL(new Blob([workerCode], { type: "text/javascript" })), [workerCode]);
    return async (payload) => {
        if (typeof payload === "function" || typeof payload === "symbol") {
            throw Error("Invalid payload type");
        }
        const result = await new Promise((resolve) => {
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

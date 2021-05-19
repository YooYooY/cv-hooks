import { useEffect, useState } from "react";

/*
 * describe  setState增加第二个参数回调 setState(newState, callback)
 *
 * @params initSate 初始化state
 * @return [state, setCVState]
 */
export const useCbState = (initState) => {
  const [state, setState] = useState(initState);
  let isUpdate = useRef();
  const setCbState = (state, cb) => {
    setState((prev) => {
      isUpdate.current = cb;
      return typeof state === "function" ? state(prev) : state;
    });
  };
  useEffect(() => {
    if (isUpdate.current) {
      isUpdate.current();
    }
  });

  return [state, setCbState];
};

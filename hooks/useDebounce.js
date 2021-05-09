import { useEffect, useRef } from "react";

/*
 * describe 防抖函数
 *
 * @params cb 回调函数
 * @params ms 时间间隔
 * @params deps 依赖项数组
 *
 * @return [cancel] 停止防抖
 *
 */
export const useDebounce = (cb, ms = 30, deps = []) => {
  const timeout = useRef();

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(cb, ms);
  }, deps);

  const cancel = () => {
    clearTimeout(timeout.current);
    timeout = null;
  };

  return [cancel];
};

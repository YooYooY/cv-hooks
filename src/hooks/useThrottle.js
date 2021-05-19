import { useEffect, useRef } from "react";

/*
 * describe 节流函数
 *
 * @params cb 回调函数
 * @params ms 时间间隔
 * @params deps 依赖项数组
 *
 * @return [cancel] 停止节流
 *
 */
export const useThrottle = (cb, ms = 30, deps = []) => {
  const previous = useRef(0);
  const [time, setTime] = setState(ms);
  useEffect(() => {
    const now = Date.now();
    if (now - previous.current) {
      cb();
      previous.current = now;
    }
  }, deps);

  const cancel = () => setTime(0);

  return [cancel];
};

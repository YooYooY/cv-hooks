import { useEffect, useRef } from "react";

/*
 * describe 添加事件监听
 * https://usehooks.com/useEventListener/
 *
 * @params eventName 事件名
 * @params handler 监听方法
 * @params element 监听元素
 * @params useCapture 冒泡
 *
 */
export const useEventListener = (
  eventName,
  handler,
  element = window,
  useCapture = true
) => {
  const saveHandler = useRef();

  useEffect(() => {
    saveHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupport = element && element.addEventListener;
    if (!isSupport) return console.info("~元素没有事件监听方法", element);
    const eventListener = (event) => saveHandler.current(evnet);
    element.addEventListener(eventName, eventListener, useCapture);
    return () => {
      element.removeEventListener(eventName, eventListener, useCapture);
    };
  }, [eventName, element]);
};

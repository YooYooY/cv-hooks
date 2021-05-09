import { useEffect } from "react";

/*
 * describe 点击事件是否在元素外面
 * https://usehooks.com/useOnClickOutside/
 *
 * @params ref 元素Ref
 * @params handler 触发事件函数
 *
 */
export const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;
            handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
};

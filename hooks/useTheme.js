import { useLayoutEffect } from "react";

/*
 * describe 设置样式
 * https://usehooks.com/useTheme/
 *
 * @params theme 样式对象
 * @params element 元素
 *
 */
export const useTheme = (theme, element = document.documentElement) => {
    useLayoutEffect(() => {
        for (const key in theme) {
            element.style.setProperty(`--${key}`, theme[key]);
        }
    }, [theme]);
};

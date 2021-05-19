import { useEffect } from "react";

/*
 * describe 设置标题
 *
 * @params title 标题名称
 *
 */
export const useTitle = (title) => {
    useEffect(() => {
        document.title = title;
    }, []);
    return null;
};

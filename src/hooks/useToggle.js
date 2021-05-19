import { useState, useCallback } from "react";

/*
 * describe toggle 显示隐藏
 * https://usehooks.com/useToggle/
 *
 * @return [state, toggle]
 *
 */
export const useToggle = (initState = false) => {
    const [state, setState] = useState();
    const toggle = useCallback(() => setState((state) => !state), []);
    return [state, toggle];
};

import { useEffect, useRef } from "react";

/*
 * describe 旧值
 * https://usehooks.com/usePrevious/
 *
 * @params value
 *
 * @return previous value
 *
 */
export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};

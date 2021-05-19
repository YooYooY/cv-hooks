import { useEffect, useState, useCallback } from "react";

/*
 * describe 异步函数
 * https://usehooks.com/useAsync/
 *
 * @params asyncFunction 异步函数
 * @params immediate 是否立即执行
 *
 * @return execute 执行函数
 * @return status 状态
 * @return value 成功返回值
 * @return error 失败返回值
 *
 */
export const useAsync = (asyncFunction, immediate = true) => {
    const [status, setStatus] = useState("idle");
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);

    const execute = useCallback(() => {
        setStatus("pending");
        setValue(null);
        setError(null);

        return asyncFunction()
            .then((response) => {
                setValue(response);
                setStatus("success");
            })
            .catch((error) => {
                setError(error);
                setStatus("error");
            });
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) execute();
    }, [execute, immediate]);

    return {
        execute,
        status,
        value,
        error,
    };
};

import { useState, useCallback } from "react";

/*
 * describe store操作
 * https://usehooks.com/useLocalStorage/
 *
 * @params key storeKey值
 * @params initialValue 初始值
 *
 * @return [storedValue, setValue, removeValue] 存储值， 设置方法，清空方法
 *
 */
export const useLoaclStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    };

    const removeValue = useCallback(() => {
        window.localStorage.removeItem(key);
    }, [key]);

    return [storedValue, setValue, removeValue];
};

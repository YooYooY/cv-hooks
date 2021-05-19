import { useState } from "react";

/*
 * describe 组件更新
 *
 * @return update() 更新方法
 *
 */
export const useUpdate = () => {
    const [, setFlag] = useState();
    const update = () => {
        setFlag(Date.now());
    };
    return update;
};

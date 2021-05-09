import { useEffect, useState } from "react";

/*
 * describe 键盘事件
 * https://usehooks.com/useKeyPress/
 *
 * @params targetKey 键盘key值
 *
 * @return keyPressed 是否按下
 *
 */
export const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);
  function downHandler({ key }) {
    if (key === targetKey) setKeyPressed(true);
  }

  // 离开键盘 重新设置为false
  const upHandler = ({ key }) => {
    if (key === targetKey) setKeyPressed(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler, false);
    window.addEventListener("keyup", upHandler, false);
    return () => {
      window.removeEventListener("keydown", downHandler, false);
      window.removeEventListener("keyup", upHandler, false);
    };
  }, []);

  return keyPressed;
};

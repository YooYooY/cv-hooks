import { useEffect, useState } from "react";

/*
 * describe 监听元素滚动位置变化
 *
 * @return pos[x,y]  返回元素滚动x，y值
 *
 */
export const useScroll = (scrollRef) => {
  const [pos, setPos] = useState([0, 0]);

  useEffect(() => {
    const handleScroll = (e) => {
      setPos([scrollRef.current.scrollLeft, scrollRef.current.scrollTop]);
    };
    scrollRef.current.addEventListener("scroll", handleScroll, false);
    return () => {
      scrollRef.current.removeEventListener("scroll", handleScroll, false);
    };
  }, []);

  return pos;
};

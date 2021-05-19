import { useEffect, useState } from "react";

/*
 * describe 是否进入屏幕可视范围
 * https://usehooks.com/useOnScreen/
 *
 * @params ref 元素Ref
 * @params rootMargin 触发距离
 *
 * @return isIntersecting 是否进入可视范围
 *
 */
export const useOnScreen = (ref, rootMargin = "0px") => {
  const [isIntersecting, setIntersection] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 进入可视区域
        setIntersection(entry, isIntersecting);
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.unobserve(ref.current);
    };
  }, []);

  return isIntersecting;
};

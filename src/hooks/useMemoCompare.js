import {
  useEffect,
  useRef,
} from 'react'


/*
 * describe memo扩展，自定义依赖项对比，例如对象属性对比
 * https://usehooks.com/useMemoCompare/
 *
 * @params {state} nextState
 * @params {Function} (prev, enxt)=>boolean
 *
 * @return {state}
 *
 */
export const useMemoCompare = (next, compare) => {
  const previousRef = useRef()
  const previous = previousRef.current

  const isEqual = compare(previous, next)

  useEffect(() => {
    if (!isEqual) previousRef.current = next
  })

  return isEqual ? previousRef : next
}
import { useEffect, useRef, useState } from 'react'

/*
 * describe  setState增加第二个参数回调 setState(newState, callback)
 *
 * @params initSate 初始化state
 * @return [state, setCVState]
 */
export const useCVState = (initState) => {
  const [state, setState] = useState(initState)
  let isUpdate = useRef()
  const setCVState = (state, cb) => {
    setState((prev) => {
      isUpdate.current = cb
      return typeof state === 'function' ? state(prev) : state
    })
  }
  useEffect(() => {
    if (isUpdate.current) {
      isUpdate.current()
    }
  })

  return [state, setCVState]
}

/*
 * describe 防抖函数
 *
 * @params cb 回调函数
 * @params ms 时间间隔
 * @params deps 依赖项数组
 *
 * @return [cancel] 停止防抖
 *
 */
export const useDebounce = (cb, ms = 30, deps = []) => {
  const timeout = useRef()

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(cb, ms)
  }, deps)

  const cancel = () => {
    clearTimeout(timeout.current)
    timeout = null
  }

  return [cancel]
}

/*
 * describe 节流函数
 *
 * @params cb 回调函数
 * @params ms 时间间隔
 * @params deps 依赖项数组
 *
 * @return [cancel] 停止节流
 *
 */
export const useThrottle = (cb, ms = 30, deps = []) => {
  const previous = useRef(0)
  const [time, setTime] = setState(ms)
  useEffect(() => {
    const now = Date.now()
    if (now - previous.current) {
      cb()
      previous.current = now
    }
  }, deps)

  const cancel = () => setTime(0)

  return [cancel]
}

/*
 * describe 设置标题
 *
 * @params title 标题名称
 *
 */
export const useTitle = (title) => {
  useEffect(() => {
    document.title = title
  }, [])
  return null
}

/*
 * describe 组件更新
 *
 * @return update() 更新方法
 *
 */
export const useUpdate = () => {
  const [, setFlag] = useState()
  const update = () => {
    setFlag(Date.now())
  }
  return update
}

/*
 * describe 监听元素滚动位置变化
 *
 * @return pos[x,y]  返回元素滚动x，y值
 *
 */
export const useScroll = (scrollRef) => {
  const [pos, setPos] = useState([0, 0])

  useEffect(() => {
    const handleScroll = (e) => {
      setPos([scrollRef.current.scrollLeft, scrollRef.current.scrollTop])
    }
    scrollRef.current.addEventListener('scroll', handleScroll, false)
    return () => {
      scrollRef.current.removeEventListener('scroll', handleScroll, false)
    }
  }, [])

  return pos
}

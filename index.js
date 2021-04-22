import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react'

/*
 * describe  setState增加第二个参数回调 setState(newState, callback)
 *
 * @params initSate 初始化state
 * @return [state, setCVState]
 */
export const useCbState = (initState) => {
  const [state, setState] = useState(initState)
  let isUpdate = useRef()
  const setCbState = (state, cb) => {
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

  return [state, setCbState]
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

/*
 * describe toggle 显示隐藏
 * https://usehooks.com/useToggle/
 *
 * @return [state, toggle]
 *
 */
export const useToggle = (initState = false) => {
  const [state, setState] = useState()
  const toggle = useCallback(() => setState((state) => !state), [])
  return [state, toggle]
}

/*
 * describe memo扩展，自定义依赖项对比，例如对象属性对比
 * https://usehooks.com/useMemoCompare/
 *
 * @return [state, toggle]
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
  const [status, setStatus] = useState('idle')
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)

  const execute = useCallback(() => {
    setStatus('pending')
    setValue(null)
    setError(null)

    return asyncFunction()
      .then((response) => {
        setValue(response)
        setStatus('success')
      })
      .catch((error) => {
        setError(error)
        setStatus('error')
      })
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) execute()
  }, [execute, immediate])

  return {
    execute,
    status,
    value,
    error,
  }
}

/*
 * describe 添加事件监听
 * https://usehooks.com/useEventListener/
 *
 * @params eventName 事件名
 * @params handler 监听方法
 * @params element 监听元素
 * @params useCapture 冒泡
 *
 */
export const useEventListener = (
  eventName,
  handler,
  element = window,
  useCapture = true
) => {
  const saveHandler = useRef()

  useEffect(() => {
    saveHandler.current = handler
  }, [handler])

  useEffect(() => {
    const isSupport = element && element.addEventListener
    if (!isSupport) return console.info('~元素没有事件监听方法', element)
    const eventListener = (event) => saveHandler.current(evnet)
    element.addEventListener(eventName, eventListener, useCapture)
    return () => {
      element.removeEventListener(eventName, eventListener, useCapture)
    }
  }, [eventName, element])
}

/*
 * describe 设置样式
 * https://usehooks.com/useTheme/
 *
 * @params theme 样式对象
 * @params element 元素
 *
 */
export const useTheme = (theme, element = document.documentElement) => {
  useLayoutEffect(() => {
    for (const key in theme) {
      element.style.setProperty(`--${key}`, theme[key])
    }
  }, [theme])
}

function createUseHistory() {
  const historyInitialState = {
    past: [], // previous state value array
    present: null, // current state value
    future: [], // if undo, add undo state in future arrary, when redo can shift to use
  }

  const historyReducer = (state, action) => {
    const { past, present, future } = state
    switch (action.type) {
      case 'UNDO':
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)
        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        }
      case 'REDO':
        const next = future[0]
        const newFuture = future.slice(1)
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        }
      case 'SET':
        const { newPresent } = action
        // 重复操作直接返回
        if (newPresent === present) return state
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        }
      case 'CLEAR':
        const { initialPresent } = action
        return {
          ...historyInitialState,
          present: initialPresent,
        }
    }
  }

  const useHistory = (initialPresent) => {
    const [state, dispatch] = useReducer(historyReducer, {
      ...historyInitialState,
      present: initialPresent,
    })

    const canUndo = state.past.length !== 0
    const canRedo = state.future.length !== 0

    // 设置回调函数，用 useCallback 包裹避免不必要的重渲染
    const undo = useCallback(() => {
      if (canUndo) dispatch({ type: 'UNDO' })
    }, [canUndo, dispatch])

    const redo = useCallback(() => {
      if (canRedo) dispatch({ type: 'REDO' })
    }, [canRedo, dispatch])

    const set = useCallback(
      (newPresent) => {
        dispatch({ type: 'SET', newPresent })
      },
      [dispatch]
    )

    const clear = useCallback(
      () => dispatch({ type: 'CLEAR', initialPresent: historyInitialState }),
      [dispatch]
    )

    return {
      state: state.present,
      set,
      undo,
      redo,
      clear,
      canUndo,
      canRedo,
    }
  }

  return useHistory
}

/*
 * describe 历史记录
 * https://usehooks.com/useHistory/
 *
 * @params initialPresent 初始值
 *
 * @return state 当前状态
 * @return set 设置新值
 * @return undo 撤销
 * @return redo 重做
 * @return clear 清除
 * @return canUndo 是否能撤销
 * @return canUndo 是否能重做
 *
 */
export const useHistory = createUseHistory()

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
  const [keyPressed, setKeyPressed] = useState(false)
  function downHandler({ key }) {
    if (key === targetKey) setKeyPressed(true)
  }

  // 离开键盘 重新设置为false
  const upHandler = ({ key }) => {
    if (key === targetKey) setKeyPressed(false)
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler, false)
    window.addEventListener('keyup', upHandler, false)
    return () => {
      window.removeEventListener('keydown', downHandler, false)
      window.removeEventListener('keyup', upHandler, false)
    }
  }, [])

  return keyPressed
}

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
export const useOnScreen = (ref, rootMargin = '0px') => {
  const [isIntersecting, setIntersection] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 进入可视区域
        setIntersection(entry, isIntersecting)
      },
      { rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      observer.unobserve(ref.current)
    }
  }, [])

  return isIntersecting
}

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
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/*
 * describe 点击事件是否在元素外面
 * https://usehooks.com/useOnClickOutside/
 *
 * @params ref 元素Ref
 * @params handler 触发事件函数
 *
 */
export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

/*
 * describe 鼠标hover事件
 * https://usehooks.com/useHover/
 *
 * @return [hoverRef, isHovered]
 *
 */
export const useHover = () => {
  const [value, setValue] = useState(false)
  const ref = useRef(null)
  const handleMouseOver = () => setValue(true)
  const handleMouseOut = () => setValue(false)
  useEffect(() => {
    const node = ref.current
    if (node) {
      node.addEventListener('mouseover', handleMouseOver)
      node.addEventListener('mouseout', handleMouseOut)
      return () => {
        node.removeEventListener('mouseover', handleMouseOver)
        node.removeEventListener('mouseout', handleMouseOut)
      }
    }
  }, [ref.current])
  return [ref, value]
}

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
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }

  const removeValue = useCallback(() => {
    window.localStorage.removeItem(key)
  }, [key]);
  
  return [storedValue, setValue, removeValue]
}

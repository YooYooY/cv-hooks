import {
  useCallback,
  useReducer,
} from 'react'

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

export const useHistory = createUseHistory()
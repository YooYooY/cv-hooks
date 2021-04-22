# 自定义hooks整理

## useCbState

新增参数回调
```js

const [state, setState] = useCbState();

setState(newState,()=>{
    // after setState
})
```

## useDebounce

> 防抖函数

```js
const [value, setValue] = setState("");

const asyncfn = ()=> fetch(url).then(res=>res.json)

const [cancel] = useDebounce(
    async ()=>{
        const res = await asyncfn();
    }, 
    3000, 
    []
)

return (<input value={value} onChange={(e)=>setValue(e.target.value)} >)
```
  
## useThrottle

> 节流函数

## useTitle

> 设置页面title标题

```js
useTitle("index page")
```

## useUpdate

> 手动触发组件更新
```js
const Home = (props)=>{
    const update = useUpdaet();
    return <button onClick={update}>{Date.now()}</button>
}
```

## useScroll

> 监听元素滚动位置变化

```js
const Home = (props) => {
  const scrollRef = useRef(null)
  const [x, y] = useScroll(scrollRef)

  return <div>
      <div ref={scrollRef}>
        <div className="innerBox"></div>
      </div>
      <div>{ x }, { y }</div>
    </div>
}
```

## useToggle

> 显示隐藏 通常用在弹框、复选框之类的场景

```js
function App() {
    const [isTextChanged, setIsTextChanged] = useToggle();
    
    return (
        <button onClick={setIsTextChanged}>{isTextChanged ? 'Toggled' : 'Click to Toggle'}</button>
    );
}
```

## useMemoCompare

>  memo扩展，可以更细分依赖项对比

```js
function App({ obj }) {
  const [state, setState] = useState();
  
  const objFinal = useMemoCompare(obj, (prev, next) => {
    return prev && prev.id === next.id;
  });
  
  useEffect(() => {
    return objFinal.someMethod().then((value) => setState(value));
  }, [objFinal]);
  
  useEffect(() => {
    return obj.someMethod().then((value) => setState(value));
  }, [obj.id]);
  
  return <div> ... </div>;
}
```

## useAsync

> 异步函数

[执行方法，状态，成功返回值，失败信息] = useAsync(异步函数，是否立即执行)

```js
function App() {
  const { execute, status, value, error } = useAsync(mockRequest, false);
  return (
    <div>
      {status === "idle" && <div>Start your journey by clicking a button</div>}
      {status === "success" && <div>{value}</div>}
      {status === "error" && <div>{error}</div>}
      <button onClick={execute} disabled={status === "pending"}>
        {status !== "pending" ? "Click me" : "Loading..."}
      </button>
    </div>
  );
}

// 模拟返回结构
const mockRequest = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rnd = Math.random() * 10;
      rnd <= 5
        ? resolve("Submitted successfully 🙌")
        : reject("Oh no there was an error 😞");
    }, 2000);
  });
};
```


## useEventListener

> 添加事件监听

```js
function App() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const handler = useCallback(
    ({ clientX, clientY }) => setCoords({ x: clientX, y: clientY }),
    [setCoords]
  );
  // 监听鼠标移动事件
  useEventListener("mousemove", handler);
  return (
    <h1>
      The mouse position is ({coords.x}, {coords.y})
    </h1>
  );
}
```

## useTheme

> 设置样式

useTheme(样式，元素=document.documentElement)

```js
const theme = {
  "button-padding": "16px",
  "button-font-size": "14px",
  "button-border-radius": "4px",
  "button-border": "none",
  "button-color": "#FFF",
  "button-background": "#6772e5",
  "button-hover-border": "none",
  "button-hover-color": "#FFF",
};
function App() {
  useTheme(theme);
  return (
    <div>
      <button className="button">Button</button>
    </div>
  );
}
```

## useHistory

> 历史记录，基于 useReducer 实现

```js
function App() {
  const { state, set, undo, redo, clear, canUndo, canRedo } = useHistory({});
  return (
    <div className="container">
      <div className="controls">
        <div className="title">👩‍🎨 Click squares to draw</div>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
        <button onClick={clear}>Clear</button>
      </div>
      <div className="grid">
        {((blocks, i, len) => {
          // Generate a grid of blocks
          while (++i <= len) {
            const index = i;
            blocks.push(
              <div
                // 选中元素添加 active 样式
                className={"block" + (state[index] ? " active" : "")}
                // toggle 选中与取消
                onClick={() => set({ ...state, [index]: !state[index] })}
                key={i}
              />
            );
          }
          return blocks;
        })([], 0, 625)}
      </div>
    </div>
  );
}
```

## useKeyPress

> 键盘事件

```js
function App() {
  const happyPress = useKeyPress("h");
  const sadPress = useKeyPress("s");
  const robotPress = useKeyPress("r");
  const foxPress = useKeyPress("f");
  
  return (
    <div>
      <div>h, s, r, f</div>
      <div>
        {happyPress && "😊"}
        {sadPress && "😢"}
        {robotPress && "🤖"}
        {foxPress && "🦊"}
      </div>
    </div>
  );
}
```

## useOnScreen

> 是否进入屏幕可视范围，基于 IntersectionObserver API 实现

```js
import { useState, useEffect, useRef } from "react";
// Usage
function App() {
  const ref = useRef();
  const onScreen = useOnScreen(ref, "-300px");
  return (
    <div>
      <div style={{ height: "100vh" }}>
        <h1>Scroll down to next section 👇</h1>
      </div>
      <div
        ref={ref}
        style={{
          height: "100vh",
          backgroundColor: onScreen ? "#23cebd" : "#efefef",
        }}
      >
        {onScreen ? (
          <div>
            <h1>Hey I'm on the screen</h1>
            <img src="https://images.dog.ceo/breeds/eskimo/n02109961_16961.jpg" />
          </div>
        ) : (
          <h1>Scroll down 300px from the top of this section 👇</h1>
        )}
      </div>
    </div>
  );
}
```

## usePrevious

> 旧值 class components 可以使用 componentDidUpdate 获取旧值，hooks 如何获取

```js
function App() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return (
    <div>
      <h1>
        Now: {count}, before: {prevCount}
      </h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

利用 useRef 特性实现：
```js
export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
```

## useOnClickOutside

> 点击事件是否在元素外面，下拉框选项卡常用

```js
function App() {
  const ref = useRef();
  
  const [isModalOpen, setModalOpen] = useState(false);
  
  useOnClickOutside(ref, () => setModalOpen(false));
  return (
    <div>
      {isModalOpen ? (
        <div ref={ref}>
          👋 Hey, I'm a modal. Click anywhere outside of me to close.
        </div>
      ) : (
        <button onClick={() => setModalOpen(true)}>Open Modal</button>
      )}
    </div>
  );
}
```

## useHover 

> 鼠标hover事件

```js
function App() {
  const [hoverRef, isHovered] = useHover();
  return <div ref={hoverRef}>{isHovered ? "😁" : "☹️"}</div>;
}
```

## useLoaclStorage

> loaclStorage操作

```js
function App() {
  const [name, setName] = useLocalStorage("name", "Bob");
  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
```
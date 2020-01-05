# 快速开始

```bash
npm install yuumi-clip --save
```

# 初始化

```js
import YuumiClip from 'yuumi-clip'
import 'yuumi-clip/release/index.css'

new YuumiClip(file: File, {
  expect?: 'base64'|'blob'|'file';
  ratio?: number;
  cancel?: (done: any) => any;
  confirm?: (data: any, done: any) => any;
})
```

![demo](https://s2.ax1x.com/2020/01/05/lDP1EQ.md.png)
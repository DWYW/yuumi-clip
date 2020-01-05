# 快速开始

```bash
npm install yuumi-clip --save
```

# 初始化

```js
import YuumiClip from 'yuumi-clip'

new YuumiClip(file: File, {
  expect?: 'base64'|'blob'|'file';
  ratio?: number;
  cancel?: (done: any) => any;
  confirm?: (data: any, done: any) => any;
})
```
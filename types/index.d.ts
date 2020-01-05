declare namespace _YuumiClip {
  type expect = 'base64'|'blob'|'file'

  interface ConstructorOptions {
    expect?: expect;
    ratio?: number;
    cancel?: (done: any) => any;
    confirm?: (data: any, done: any) => any;
  }
}

declare class YuumiClip {
  constructor(file:File, options: _YuumiClip.ConstructorOptions);
  destroy: () => void;
}

export default YuumiClip

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
  constructor(options: _YuumiClip.ConstructorOptions);
}

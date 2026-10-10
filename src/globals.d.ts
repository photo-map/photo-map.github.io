// 由 public/index.html 的 <script> 在运行时注入的第三方浏览器全局对象。
//
// react-bmapgl 自带 BMapGL 命名空间的类型声明（types/bmapgl/*.d.ts），
// 但它的 "types" 入口 dist/index.d.ts 并未引用这些声明文件，所以这里手动补一条
// triple-slash reference，让 `BMapGL.Point` 之类的类型在本项目中可见。

/// <reference path="../node_modules/react-bmapgl/types/bmapgl/index.d.ts" />

interface Window {
  /** 百度地图 JSAPI GL，由 public/index.html 的 script 加载 */
  BMapGL: typeof BMapGL;
  /** 高德地图 JSAPI，未配置 key 时为 undefined */
  AMap: any;
  /** Google Maps JS API，未配置 key 时为 undefined */
  google: any;
  /** Google API Platform 加载器（platform.js），未配置 key 时为 undefined */
  gapi: any;
  /** platform.js 是否已加载完成，定义在 public/index.html */
  gapiLoadedFlag?: boolean;
  /** trainSearch 流程里缓存的火车时刻表 JSON，由 Map/index.tsx 赋值 */
  PM_trainsMap: Record<string, any>;
}

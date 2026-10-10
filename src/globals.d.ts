// 由根 index.html 的 <script> 在运行时注入的第三方浏览器全局对象。

interface Window {
  /** 高德地图 JSAPI，未配置 key 时为 undefined */
  AMap: any;
  /** Google API Platform 加载器（platform.js），未配置 key 时为 undefined */
  gapi: any;
  /** platform.js 是否已加载完成，定义在根 index.html */
  gapiLoadedFlag?: boolean;
  /** trainSearch 流程里缓存的火车时刻表 JSON，由 Map/index.tsx 赋值 */
  PM_trainsMap: Record<string, any>;
}

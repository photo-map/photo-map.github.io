/**
 * 百度地图相关的类型。
 *
 * 运行时的坐标值是 `{ lat, lng }` 纯对象（见 `helpers.ts` 与 `../helpers.js`），
 * 结构上与 `BMapGL.Point` 兼容，因此直接别名成 `BMapGL.Point`，
 * 避免在传给 `<Marker position>` / `map.setViewport()` 时到处断言。
 */
export type BMapPoint = BMapGL.Point;

/** key 是 `${lat},${lng}`，value 是百度坐标 */
export type GpsBMapPointsMapping = Record<string, BMapPoint>;

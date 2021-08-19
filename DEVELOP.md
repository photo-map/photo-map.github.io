# DEVELOP

## Init

Project init with:

```
$ yarn add react-google-maps
$ yarn add recompose
$ yarn add react-amap

```

## How to callback to React when Google API script loaded

Refer to [https://stackoverflow.com/questions/37081803/how-do-i-use-the-window-object-in-reactjs](https://stackoverflow.com/questions/37081803/how-do-i-use-the-window-object-in-reactjs)

```js
componentDidMount() {
 window.handleGoogleClientLoad = function() {
  // log to console
 }
 loadjs('https://apis.google.com/js/client.js?onload=handleGoogleClientLoad')
}
```

## react-amap

[Map 组件](https://elemefe.github.io/react-amap/components/map)

## AMap API

- [地图 JS API 示例中心](https://lbs.amap.com/demo-center/js-api)
- [Map 类](https://lbs.amap.com/api/javascript-api/reference/map)

## Baidu Map

After `react-bmapgl` is loaded, you could use `window.BMapGL` in the source code.
For example, you could create marker with `window.BMapGL.Marker()`.
For more details please view [https://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html](https://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html)

## z-index

- .application .menu-btn-wrapper - 999
- .message-wrapper - 10
- #mask (baidu map) - 9

## Jest

Currently all tests are running in the `jsdom` test environment. Check this document to find out the differences between `jsdom` and `node`.

## References

- https://developers.google.com/photos/library/guides/overview
- Some same website
  - https://www.pic2map.com/

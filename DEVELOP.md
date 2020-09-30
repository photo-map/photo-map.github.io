# DEVELOP

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

## References

- https://developers.google.com/photos/library/guides/overview
- Some same website
  - https://www.pic2map.com/

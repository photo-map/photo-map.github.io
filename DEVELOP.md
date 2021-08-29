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

Should not test `react-bmapgl`: [https://d3vinc.github.io/2021/08/19/create-react-app-unittest-failed-typeerror-cannot-read-property-parentnode-of-undefined.html](https://d3vinc.github.io/2021/08/19/create-react-app-unittest-failed-typeerror-cannot-read-property-parentnode-of-undefined.html)

## Add env

1. Add "Repository secret" in [https://github.com/photo-map/photo-map.github.io/settings/secrets/actions](https://github.com/photo-map/photo-map.github.io/settings/secrets/actions)
2. Update `.github/workflows/build-deploy.yml`

```yml
env:
  ...
  REACT_APP_BAIDU_MAP_AK: ${{ secrets.REACT_APP_BAIDU_MAP_AK }}
```

3. Add to source code

```html
<script
  type="text/javascript"
  src="//api.map.baidu.com/api?type=webgl&v=1.0&ak=%REACT_APP_BAIDU_MAP_AK%"
></script>
```

or

```jsx
<Map amapkey={process.env.REACT_APP_AMAP_API_KEY} />
```

## keep dependencies update to date

```
$ npm outdated
$ yarn add @ant-design/icons
```

## API documents

- Baidu Map
  - JavaScript API v2.0 类参考 - https://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html
  - React-BMapGL 文档 - https://lbsyun.baidu.com/solutions/reactBmapDoc

## References

- https://developers.google.com/photos/library/guides/overview
- Some same website
  - https://www.pic2map.com/

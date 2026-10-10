# DEVELOP

## Init

Project init with:

```
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

## z-index

- .application .menu-btn-wrapper - 999
- .message-wrapper - 10

## Vitest

Tests run with [Vitest](https://vitest.dev/) in the `jsdom` environment
(configured in `vite.config.ts` under `test.environment`). `npm test` runs once,
`npm run test:watch` watches.

## Add env

1. Add "Repository secret" in [https://github.com/photo-map/photo-map.github.io/settings/secrets/actions](https://github.com/photo-map/photo-map.github.io/settings/secrets/actions)
2. Update `.github/workflows/build-deploy.yml`

```yml
env:
  ...
  REACT_APP_AMAP_API_KEY: ${{ secrets.REACT_APP_AMAP_API_KEY }}
```

3. Add to source code

```jsx
<Map amapkey={import.meta.env.REACT_APP_AMAP_API_KEY} />
```

## keep dependencies update to date

```
$ npm outdated
$ yarn add @ant-design/icons
```

## References

- https://developers.google.com/photos/library/guides/overview
- Some same website
  - https://www.pic2map.com/

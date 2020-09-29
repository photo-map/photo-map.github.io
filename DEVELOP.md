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

## References

- https://developers.google.com/photos/library/guides/overview
- Some same website
  - https://www.pic2map.com/

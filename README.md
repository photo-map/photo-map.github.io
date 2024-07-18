# photo-map.github.io [![Build Status](https://github.com/photo-map/photo-map.github.io/actions/workflows/build-deploy.yml/badge.svg)](https://github.com/photo-map/photo-map.github.io/actions/workflows/build-deploy.yml) [![codecov](https://codecov.io/gh/photo-map/photo-map.github.io/branch/master/graph/badge.svg?token=JZLPHQKY83)](https://codecov.io/gh/photo-map/photo-map.github.io) [![Known Vulnerabilities](https://snyk.io/test/github/photo-map/photo-map.github.io/badge.svg)](https://snyk.io/test/github/photo-map/photo-map.github.io)

## Summary

Show your photos on the Google Maps or AMap. Please try it on this website: [https://photo-map.github.io](https://photo-map.github.io)

- Load photos from Google Drive public folder
- Load photos from Google Drive private folder (need login from Google)

## Snapshots

Photos on the AMap

![](demo-amap.jpg)

Photos on the Google Maps

![](demo-google-map.jpg)

## Develop

Generate `.env.local` with content:

```
REACT_APP_GOOGLE_MAPS_API_KEY=AIz***kC8
REACT_APP_AMAP_API_KEY=ef0***63e
REACT_APP_BAIDU_MAP_AK=72y***QFK
```

Run dev server.

```sh
$ npm i
$ npm start
```

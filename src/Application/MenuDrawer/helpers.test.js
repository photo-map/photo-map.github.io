import { link2Id, exportConfig, importConfig } from "./helpers";
import {
  localStorageKeyPrivateFolderVisible,
  localStorageKeyPublicFolders,
} from "./FolderList";
import { localStorageKeySelectedMap } from "../Map";

test("link2Id should return proper value", () => {
  expect(
    link2Id(
      "https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing"
    )
  ).toBe("13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr");
});

test("exportConfig should return proper value", () => {
  const mockLocalStorage = {
    getItem: (key) => {
      switch (key) {
        case localStorageKeyPrivateFolderVisible:
          return "true";
        case localStorageKeyPublicFolders:
          return '{"1Al9VyGjXwyk4WSfM-qZkW5fYosThjd_v":true}';
        case localStorageKeySelectedMap:
          return "amap";
        default:
          return null;
      }
    },
  };
  expect(exportConfig(mockLocalStorage)).toBe(
    "data:text/json;charset=utf-8,%7B%0A%20%20%22pmap%3AprivateFolderVisible%22%3A%20%22true%22%2C%0A%20%20%22pmap%3ApublicFolders%22%3A%20%22%7B%5C%221Al9VyGjXwyk4WSfM-qZkW5fYosThjd_v%5C%22%3Atrue%7D%22%2C%0A%20%20%22pmap%3A%3AselectedMap%22%3A%20%22amap%22%0A%7D"
  );
});

test("importConfig should write config to localStorage", () => {
  const obj = {
    "pmap:privateFolderVisible": "true",
    "pmap:publicFolders": '{"1Al9VyGjXwyk4WSfM-qZkW5fYosThjd_v":true}',
    "pmap::selectedMap": "amap",
  };
  const mockLocalStorage = {
    setItem: (key, value) => {
      switch (key) {
        case localStorageKeyPrivateFolderVisible:
          expect(value).toBe("true");
          break;
        case localStorageKeyPublicFolders:
          expect(value).toBe('{"1Al9VyGjXwyk4WSfM-qZkW5fYosThjd_v":true}');
          break;
        case localStorageKeySelectedMap:
          expect(value).toBe("amap");
          break;
        default:
          return undefined;
      }
    },
  };
  importConfig(mockLocalStorage, obj);
});

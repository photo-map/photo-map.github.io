import { link2Id, exportConfig, importConfig } from "./helpers";
import {
  localStorageKeyPrivateFolderVisible,
  localStorageKeyPublicFolders,
} from "./FolderList";

test("link2Id should return proper value", () => {
  expect(
    link2Id(
      "https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing"
    )
  ).toBe("13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr");
});

test("exportConfig should return proper value", () => {
  const mockLocalStorage = {
    getItem: (key: string) => {
      switch (key) {
        case localStorageKeyPrivateFolderVisible:
          return "true";
        case localStorageKeyPublicFolders:
          return '{"1Al9VyGjXwyk4WSfM-qZkW5fYosThjd_v":true}';
        default:
          return null;
      }
    },
  };

  const prefix = "data:text/json;charset=utf-8,";
  const result = exportConfig(mockLocalStorage);
  expect(result.startsWith(prefix)).toBe(true);
  expect(JSON.parse(decodeURIComponent(result.slice(prefix.length)))).toEqual({
    "pmap:privateFolderVisible": "true",
    "pmap:publicFolders": '{"1Al9VyGjXwyk4WSfM-qZkW5fYosThjd_v":true}',
  });
});

test("importConfig should write config to localStorage", () => {
  const obj = {
    "pmap:privateFolderVisible": "true",
    "pmap:publicFolders": '{"1Al9VyGjXwyk4WSfM-qZkW5fYosThjd_v":true}',
  };
  const mockLocalStorage = {
    setItem: (key: string, value: string) => {
      switch (key) {
        case localStorageKeyPrivateFolderVisible:
          expect(value).toBe("true");
          break;
        case localStorageKeyPublicFolders:
          expect(value).toBe('{"1Al9VyGjXwyk4WSfM-qZkW5fYosThjd_v":true}');
          break;
        default:
          return undefined;
      }
    },
  };
  importConfig(mockLocalStorage, obj);
});

import {
  localStorageKeyPrivateFolderVisible,
  localStorageKeyPublicFolders,
} from "./FolderList";
import { localStorageKeySelectedMap } from "../Map/constants";

/**
 * Convert folder web link: https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing
 * to folder ID: 13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr
 * @param {string} link
 * @returns {string}
 */
export const link2Id = (link) =>
  link
    .replace("https://drive.google.com/drive/folders/", "")
    .replace("?usp=sharing", "");

export const exportConfig = (localStorage) => {
  const storageObj = {
    [localStorageKeyPrivateFolderVisible]: localStorage.getItem(
      localStorageKeyPrivateFolderVisible
    ),
    [localStorageKeyPublicFolders]: localStorage.getItem(
      localStorageKeyPublicFolders
    ),
    [localStorageKeySelectedMap]: localStorage.getItem(
      localStorageKeySelectedMap
    ),
  };
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(storageObj, null, 2));
  return dataStr;
};

export const importConfig = (localStorage, configObj) => {
  localStorage.setItem(
    localStorageKeyPrivateFolderVisible,
    configObj[localStorageKeyPrivateFolderVisible]
  );
  localStorage.setItem(
    localStorageKeyPublicFolders,
    configObj[localStorageKeyPublicFolders]
  );
  localStorage.setItem(
    localStorageKeySelectedMap,
    configObj[localStorageKeySelectedMap]
  );
};

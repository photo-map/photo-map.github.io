import {
  localStorageKeyPrivateFolderVisible,
  localStorageKeyPublicFolders,
} from "./FolderList";

/**
 * Convert folder web link: https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing
 * to folder ID: 13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr
 */
export const link2Id = (link: string): string =>
  link
    .replace("https://drive.google.com/drive/folders/", "")
    .replace("?usp=sharing", "");

export const exportConfig = (localStorage: Pick<Storage, "getItem">) => {
  const storageObj = {
    [localStorageKeyPrivateFolderVisible]: localStorage.getItem(
      localStorageKeyPrivateFolderVisible
    ),
    [localStorageKeyPublicFolders]: localStorage.getItem(
      localStorageKeyPublicFolders
    ),
  };
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(storageObj, null, 2));
  return dataStr;
};

export const importConfig = (
  localStorage: Pick<Storage, "setItem">,
  configObj: Record<string, unknown>
) => {
  localStorage.setItem(
    localStorageKeyPrivateFolderVisible,
    configObj[localStorageKeyPrivateFolderVisible] as string
  );
  localStorage.setItem(
    localStorageKeyPublicFolders,
    configObj[localStorageKeyPublicFolders] as string
  );
};
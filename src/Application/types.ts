/**
 * 领域类型（取代原先 `Map/typedef.js` 里的 `PropTypes.shape`）。
 *
 * 命名与 Google Drive API 响应对应，见：
 * https://developers.google.com/drive/api/v3/reference/files
 */

/** 照片的 GPS 坐标（WGS-84），来自 Google Drive 的 `imageMediaMetadata` */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  altitude: number;
}

/**
 * Google Drive 的 `imageMediaMetadata`。
 * 只有带 GPS 的照片才会返回 `location`。
 */
export interface ImageMediaMetadata {
  location?: GeoLocation;
}

/** Google Drive 里的一张照片（`files.list` 的 `fields` 只取这几个字段） */
export interface DriveFile {
  /** Drive 文件 id；photos 查询未请求该字段时也不读取，JSON 查询会显式请求 */
  id: string;
  name?: string;
  mimeType?: string;
  thumbnailLink?: string;
  webContentLink?: string;
  webViewLink?: string;
  imageMediaMetadata?: ImageMediaMetadata;
}

/** 一个照片文件夹（私有「Photo Map」文件夹，或某个公开文件夹） */
export interface PhotoFolder {
  folderId: string;
  files: DriveFile[];
  visible?: boolean;
  folderName?: string;
}

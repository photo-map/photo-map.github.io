import type { DriveFile } from "../types";
import gapiRequest from "./gapiRequest";

/** Response of listing files from Google Drive */
export interface FilesListResponse {
  files: DriveFile[];
  /**
   * Drive API 在出错时返回 `{ error: { code, message } }`（见
   * https://developers.google.com/drive/api/reference/rest/v3/files/list#response-body）。
   * gapiRequest 直接返回解析后的 JSON，所以调用方会用 `resp.error` 做运行时防御
   * （如 `Map/helpers.ts` 的 `getPhotosInPublicFolder`）。
   */
  error?: { code?: number; message: string };
}

interface FileGetParams {
  fileId: string;
  /** https://developers.google.com/drive/api/v3/reference/files/get#parameters */
  alt?: string;
}

/**
 * Get one single file from Google Drive according to fileId
 * API: https://developers.google.com/drive/api/v3/reference/files/get#request
 */
export const filesGet = async <T = DriveFile>(
  params: FileGetParams
): Promise<T> => {
  if (params.alt) {
    return await gapiRequest<T>({
      path: `https://www.googleapis.com/drive/v3/files/${params.fileId}?alt=${params.alt}`,
    });
  }
  return await gapiRequest<T>({
    path: `https://www.googleapis.com/drive/v3/files/${params.fileId}`,
  });
};

/**
 * Lists the user's files.
 * - Get files in folder: params={q: "'folderId' in parents"}
 * API: https://developers.google.com/drive/api/v3/reference/files/list#request
 */
export const filesList = async (
  params?: Record<string, unknown>
): Promise<FilesListResponse> =>
  await gapiRequest<FilesListResponse>({
    path: "https://www.googleapis.com/drive/v3/files",
    params,
  });

// In this way, the API style is like: https://developers.google.com/drive/api/reference/rest/v3/files/get#request
export const files = {
  get: filesGet,
  list: filesList,
};
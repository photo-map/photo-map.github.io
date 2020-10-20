import gapiRequest from "./gapiRequest";

/**
 * API: https://developers.google.com/drive/api/v3/reference/files/get#request
 * @param {Object} params https://developers.google.com/drive/api/v3/reference/files/get#parameters
 * @returns {Promise<FilesGetResponse>}
 */
export const filesGet = async (params) =>
  await gapiRequest({
    path: `https://www.googleapis.com/drive/v3/files/${params.fileId}`,
  });

/**
 * API: https://developers.google.com/drive/api/v3/reference/files/list#request
 * @returns {Promise<FilesListResponse>}
 */
export const filesList = async (params) =>
  await gapiRequest({
    path: "https://www.googleapis.com/drive/v3/files",
    params,
  });

import gapiRequest from './gapiRequest';

/**
 * API: https://developers.google.com/drive/api/v3/reference/files/get#request
 * @param {Object} params https://developers.google.com/drive/api/v3/reference/files/get#parameters
 * @param {string} params.alt Could be "media"
 *
 * @returns {Promise<FilesGetResponse>}
 */
export const filesGet = async (params) => {
  if (params.alt) {
    return await gapiRequest({
      path: `https://www.googleapis.com/drive/v3/files/${params.fileId}?alt=${params.alt}`,
    });
  }
  return await gapiRequest({
    path: `https://www.googleapis.com/drive/v3/files/${params.fileId}`,
  });
};

// In this way, the API style is like: https://developers.google.com/drive/api/reference/rest/v3/files/get#request
export const files = {
  get: filesGet,
};

/**
 * File from Google Drive
 *
 * sample of file
 *
 * ```json
 * {
 *   "imageMediaMetadata": {
 *     "location": {
 *       "altitude": 63.91292952824694,
 *       "latitude": 1.87650555555555,
 *       "longitude": 103.20539722222223
 *     }
 *   },
 *   "thumbnailLink": "https://lh3.googleusercontent.com/zugQb...tO6f0mfk7-al8xxDb4=s220",
 *   "webContentLink": "https://drive.google.com/uc?id=1f8...De&export=download",
 *   "webViewLink": "https://drive.google.com/file/d/1f8...wDe/view?usp=drivesdk"
 * }
 * ```
 * @typedef {Object} File
 * @property {Object} imageMediaMetadata
 * @property {string} thumbnailLink
 * @property {string} webContentLink
 * @property {string} webViewLink
 */

/**
 * Response of getting files from Google Drive
 *
 * Sample of response
 *
 * ```json
 * {
 *   "files": [{
 *     "thumbnailLink": "https://lh3.googleusercontent.com/rSd...220",
 *     "imageMediaMetadata": {
 *       "location": {
 *         "latitude": 1,
 *         "longitude": 103,
 *         "altitude": 456
 *       }
 *     }
 *   }]
 * }
 * ```
 *
 * @typedef {Object} FilesListResponse
 * @property {File[]} files
 */

/**
 * API: https://developers.google.com/drive/api/v3/reference/files/list#request
 * @returns {Promise<FilesListResponse>}
 */
export const filesList = async (params) =>
  await gapiRequest({
    path: 'https://www.googleapis.com/drive/v3/files',
    params,
  });

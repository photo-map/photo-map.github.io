/**
 * Send Google API request
 * Used to get files from Google Drive
 * @export
 * @param {*} requestOpts
 * @returns
 */
export default function gapiRequest(requestOpts) {
  return new Promise((resolve, reject) => {
    // https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md#----gapiclientrequestargs--
    var restRequest = window.gapi.client.request(requestOpts);
    restRequest.execute((resp) => {
      resolve(resp);
    });
  });
}

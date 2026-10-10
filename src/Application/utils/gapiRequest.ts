export interface GapiRequestOptions {
  path: string;
  params?: Record<string, unknown>;
}

/**
 * Send Google API request
 * Used to get files from Google Drive
 * @param requestOpts https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md#----gapiclientrequestargs--
 * @returns Promise of the API response
 */
export default function gapiRequest<T = unknown>(
  requestOpts: GapiRequestOptions
): Promise<T> {
  return new Promise((resolve, reject) => {
    // window.gapi 目前是 any（见 src/globals.d.ts），response 形状不做类型断言
    const restRequest: any = window.gapi.client.request(requestOpts);
    restRequest.execute((resp: any) => {
      resolve(resp);
    });
  });
}
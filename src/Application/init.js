import ReactGA from "react-ga";
import { gaTrackId } from "./config";

export const initGa = () => {
  ReactGA.initialize(gaTrackId, {
    debug: true,
  });
};

/**
 * After gapi.client is loaded by gapi.load('client'), then you could use method like:
 * ```
 * gapi.client.request()
 * ```
 * https://github.com/google/google-api-javascript-client/blob/master/samples/simpleRequest.html
 * @returns {Promise<undefined>}
 */
export const initGapiClient = () =>
  new Promise((resolve, reject) => {
    window.gapi.load("client", () => {
      resolve();
    });
  });

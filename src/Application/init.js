import PubSub from "pubsub-js";
import ReactGA from "react-ga";

import { gaTrackId } from "./config";
import { OPEN_CLOSE_DRAWER_TOPIC } from "./MenuDrawer";
import { SWITCH_MAP_TOPIC } from "./Map";

export const initGa = () => {
  ReactGA.initialize(gaTrackId, {
    // debug: true,
  });
};

export const registerShortcut = () => {
  document.addEventListener(
    "keyup",
    (event) => {
      switch (event.code) {
        // Open or close left menu
        case "KeyM": {
          PubSub.publish(OPEN_CLOSE_DRAWER_TOPIC);
          break;
        }
        // Switch AMap and Google Maps
        case "KeyS": {
          PubSub.publish(SWITCH_MAP_TOPIC);
          break;
        }
        default: {
          break;
        }
      }
    },
    false
  );
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

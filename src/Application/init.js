import ReactGA from "react-ga";
import { gaTrackId } from "./config";

export const initGa = () => {
  ReactGA.initialize(gaTrackId, {
    debug: true,
  });
};

/**
 * @returns {Promise<undefined>}
 */
export const initGapiClient = () =>
  new Promise((resolve, reject) => {
    window.gapi.load("client", () => {
      resolve();
    });
  });

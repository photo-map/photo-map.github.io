/**
 * Convert folder web link: https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing
 * to folder ID: 13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr
 * @param {string} link
 * @returns {string}
 */
export const link2Id = (link) =>
  link
    .replace("https://drive.google.com/drive/folders/", "")
    .replace("?usp=sharing", "");

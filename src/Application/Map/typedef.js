import PropTypes from "prop-types";

const locationType = PropTypes.shape({
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  altitude: PropTypes.number.isRequired,
});

const imageMediaMetadataType = PropTypes.shape({
  location: locationType,
});

const fileType = PropTypes.shape({
  webContentLink: PropTypes.string,
  webViewLink: PropTypes.string,
  thumbnailLink: PropTypes.string,
  imageMediaMetadata: imageMediaMetadataType,
});

export const folderType = PropTypes.shape({
  folderId: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(fileType).isRequired,
  visible: PropTypes.bool,
  folderName: PropTypes.string,
});

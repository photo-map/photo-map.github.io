import gapiRequest from "./gapiRequest";

export default function loadAlbums(setMediaItems) {
  gapiRequest({
    path: "https://photoslibrary.googleapis.com/v1/albums",
  })
    .then((resp) => {
      console.log("photo albums list response:", resp);

      let foundAlbum;
      resp.albums.forEach((album) => {
        if (album.title !== "Photo Map") return;

        foundAlbum = album;
      });

      return gapiRequest({
        path: "https://photoslibrary.googleapis.com/v1/mediaItems:search",
        method: "POST",
        body: {
          pageSize: "100",
          albumId: foundAlbum.id,
        },
      });
    })
    .then((resp) => {
      resp.mediaItems.forEach((item) => {
        // type of item
        // https://developers.google.com/photos/library/reference/rest/v1/mediaItems
        console.log("xxxx", item);
      });
    });
}

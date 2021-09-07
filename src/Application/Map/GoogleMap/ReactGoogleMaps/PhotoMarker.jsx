import React, { useState } from "react";
import { Marker, InfoWindow } from "react-google-maps";

import InfoWindowContent from "../InfoWindowContent";

export default function PhotoMarker(props) {
  const [open, setOpen] = useState(false);

  return (
    <Marker {...props} onClick={() => setOpen(true)}>
      {open && (
        <InfoWindow onCloseClick={() => setOpen(false)}>
          <InfoWindowContent {...props} />
        </InfoWindow>
      )}
    </Marker>
  );
}

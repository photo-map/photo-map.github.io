import React, { useState } from "react";
import { Marker, InfoWindow } from "react-google-maps";

export default function PhotoMarker(props) {
  const [open, setOpen] = useState(false);

  return (
    <Marker {...props} onClick={() => setOpen(true)}>
      {open && (
        <InfoWindow onCloseClick={() => setOpen(false)}>
          <div>
            <img src={props.icon.url} alt="Photos" />
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
}

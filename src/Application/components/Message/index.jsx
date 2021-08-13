import React from "react";
import "./index.css";

/**
 * Render some messages like loading gapi or others
 * These message will be above the map
 */
export default function Message(props) {
  const { message } = props;
  if (!message) {
    return null;
  }
  return (
    <div className="message-wrapper">
      <div className="message-body">
        <span className="message-content">{message}</span>
      </div>
    </div>
  );
}

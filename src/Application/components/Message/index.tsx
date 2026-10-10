import React from 'react';

import './index.css';

interface MessageProps {
  message?: string | null;
}

/**
 * Render some messages like loading gapi or others
 * These message will be above the map
 */
export default function Message(props: MessageProps) {
  const { message } = props;
  if (!message) {
    return null;
  }
  return (
    <div className='message-wrapper'>
      <div className='message-body'>
        <span className='message-content'>{message}</span>
      </div>
    </div>
  );
}
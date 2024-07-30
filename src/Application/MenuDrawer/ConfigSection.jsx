import React, { useRef, useState } from 'react';
import { Button } from 'antd';

import { exportConfig, importConfig } from './helpers';

export default function ConfigSection() {
  const downloadRef = useRef();
  const inputRef = useRef();
  const [href, setHref] = useState('{}');

  const handleDownload = () => {
    setHref(exportConfig(localStorage));
    if (downloadRef.current) {
      downloadRef.current.click();
    } else {
      alert('downloadRef or node is undefined!');
    }
  };

  const handleImport = () => {
    if (inputRef.current) {
      inputRef.current.click();
    } else {
      alert('inputRef or node is undefined!');
    }
  };

  const handleChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const data = await new Response(file).text();
      var obj = JSON.parse(data);
      importConfig(localStorage, obj);
    }
  };

  return (
    <div>
      <h3>Import/Export application config</h3>
      <a
        ref={downloadRef}
        href={href}
        style={{ display: 'none' }}
        download='photo-map-config.json'
      >
        Download Config File
      </a>
      <Button onClick={handleDownload}>Export</Button>
      <input
        ref={inputRef}
        className='import-config-file-helper'
        type='file'
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <Button onClick={handleImport}>Import</Button>
    </div>
  );
}

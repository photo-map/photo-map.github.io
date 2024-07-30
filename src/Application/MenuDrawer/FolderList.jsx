import React, { useState, useEffect } from 'react';
import { Checkbox, Button, Popconfirm } from 'antd';
import PubSub from 'pubsub-js';
import debugModule from 'debug';

import {
  SHOW_MARKERS_TOPIC,
  HIDE_MARKERS_TOPIC,
  REMOVE_MARKERS_IN_FOLDER_TOPIC,
} from '../Map/AMap/constants';
import { PRIVATE_FOLDER_ID } from '../constants';

const debug = debugModule(
  'photo-map:src/Application/MenuDrawer/FolderList.jsx'
);

export const ADD_PUBLIC_FOLDER_TOPIC = 'publicfolder.add';
export const localStorageKeyPublicFolders = 'pmap:publicFolders';
export const localStorageKeyPrivateFolderVisible = 'pmap:privateFolderVisible';

// Encode the public folders state to save in localStorage
// React state --(encode)-> localStorage
export const encode = (value) => {
  const content = {};
  value.forEach((folderInfo) => {
    content[folderInfo.folderId] = folderInfo.visible;
  });
  return JSON.stringify(content);
};
// Decode the public folders content in localStorage to save to state
// localStorage --(decode)-> React state
export const decode = () => {
  return JSON.parse(localStorage.getItem(localStorageKeyPublicFolders));
};

function FolderList(props) {
  const [state, setState] = useState({
    // Whether to show photos in the private folder.
    privateFolderVisible: true,
    // The folder id, name and visible of public folders.
    // The key is folder ID from https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing
    // [
    //   {folderId:"13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr",visible:true,name:"Dog Photos"}
    // ]
    publicFolders: [],
  });

  useEffect(() => {
    addSubscribers();

    // Load state from localStorage
    setState((prevState) => ({
      ...prevState,
      privateFolderVisible:
        localStorage.getItem(localStorageKeyPrivateFolderVisible) === 'true',
    }));

    return () => {
      removeSubscribers();
    };
  }, []);

  // turn on/off the visible of private folder
  const handlePrivateFolderCheckboxChange = (event) => {
    const { checked } = event.target;
    updatePrivateFolderVisible(checked);
    PubSub.publish(checked ? SHOW_MARKERS_TOPIC : HIDE_MARKERS_TOPIC, {
      folderId: PRIVATE_FOLDER_ID,
    });
  };

  const addSubscribers = () => {
    const openDrawerToken = PubSub.subscribe(
      ADD_PUBLIC_FOLDER_TOPIC,
      addPublicFolderSubscriber
    );
    return openDrawerToken;
  };

  const removeSubscribers = () => {
    PubSub.unsubscribe(addSubscribers());
  };

  const addPublicFolderSubscriber = (msg, folderInfo) => {
    addPublicFolder(folderInfo);
  };

  const updatePrivateFolderVisible = (visible) => {
    setState((prevState) => ({
      ...prevState,
      privateFolderVisible: visible,
    }));
    localStorage.setItem(localStorageKeyPrivateFolderVisible, visible);
  };

  /**
   * @param {FolderInfo} folderInfo
   * @memberof FolderList
   */
  const addPublicFolder = (folderInfo) => {
    const { publicFolders } = state;
    const newPublicFolderState = [...publicFolders, folderInfo];
    setState((prevState) => ({
      ...prevState,
      publicFolders: newPublicFolderState,
    }));
    localStorage.setItem(
      localStorageKeyPublicFolders,
      encode(newPublicFolderState)
    );
  };

  const updatePublicFolderVisiable = (folderId, visible) => {
    const { publicFolders } = state;
    const newState = [...publicFolders];
    newState.forEach((folderInfo, index) => {
      if (folderInfo.folderId === folderId) {
        newState[index] = { ...folderInfo, visible };
      }
    });
    setState((prevState) => ({
      ...prevState,
      publicFolders: newState,
    }));
    localStorage.setItem(localStorageKeyPublicFolders, encode(newState));
  };

  const updateMarkersVisible = (visible, folderId) => {
    PubSub.publish(visible ? SHOW_MARKERS_TOPIC : HIDE_MARKERS_TOPIC, {
      folderId,
    });
  };

  const removePublicFolder = (folderId) => {
    setState((prevState) => {
      const newState = prevState.publicFolders.filter(
        (folderInfo) => folderInfo.folderId !== folderId
      );
      localStorage.setItem(localStorageKeyPublicFolders, encode(newState));
      return { ...prevState, publicFolders: newState };
    });
  };

  const removeMarkersInFolder = (folderId) => {
    PubSub.publish(REMOVE_MARKERS_IN_FOLDER_TOPIC, {
      folderId,
    });
  };

  const getPhotoCountInFolder = (folderId) => {
    let photoCountInFolder = 'Unknown count';
    const folder = props.folders.find((folder) => folder.folderId === folderId);
    if (folder) {
      photoCountInFolder = folder.files.length + '';
    }
    return photoCountInFolder;
  };

  const renderPublicFolders = () => {
    const { publicFolders } = state;

    if (publicFolders.length === 0) {
      return 'No data';
    }

    return publicFolders.map(renderPublicFolder);
  };

  const renderPublicFolder = (folderInfo) => {
    const { folderId } = folderInfo;
    const handleChange = (event) => {
      updatePublicFolderVisiable(folderId, event.target.checked);
      updateMarkersVisible(event.target.checked, folderId);
    };

    const handleDelete = () => {
      removePublicFolder(folderId);
      removeMarkersInFolder(folderId);
    };

    return (
      <div key={folderInfo.folderId}>
        <Checkbox checked={folderInfo.visible} onChange={handleChange}>
          {folderInfo.folderName} ({getPhotoCountInFolder(folderId)}) :{' '}
          {folderInfo.folderId}{' '}
          <Popconfirm
            title='Are you sure delete this folder?'
            onConfirm={handleDelete}
            onCancel={() => {}}
            okText='Yes'
            cancelText='No'
          >
            <Button size='small' type='danger'>
              Del
            </Button>
          </Popconfirm>
        </Checkbox>
      </div>
    );
  };

  debug('render()', props, state);

  return (
    <div>
      <div>
        <h3>Private folder in Google Drive</h3>
        <Checkbox
          checked={state.privateFolderVisible}
          onChange={handlePrivateFolderCheckboxChange}
        >
          "Photo Map" folder in Google Drive of the login user (
          {getPhotoCountInFolder(PRIVATE_FOLDER_ID)})
        </Checkbox>
      </div>
      <div>
        <h3>Public folder in Google Drive</h3>
        {renderPublicFolders()}
      </div>
    </div>
  );
}

export default FolderList;

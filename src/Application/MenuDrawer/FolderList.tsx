import React, { useState, useEffect, useCallback } from 'react';
import { Checkbox, Button, Popconfirm } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import PubSub from 'pubsub-js';

import {
  SHOW_MARKERS_TOPIC,
  HIDE_MARKERS_TOPIC,
  REMOVE_MARKERS_IN_FOLDER_TOPIC,
} from '../Map/AMap/constants';
import { PRIVATE_FOLDER_ID } from '../constants';
import type { PhotoFolder } from '../types';

export const ADD_PUBLIC_FOLDER_TOPIC = 'publicfolder.add';
export const localStorageKeyPublicFolders = 'pmap:publicFolders';
export const localStorageKeyPrivateFolderVisible = 'pmap:privateFolderVisible';

// Encode the public folders state to save in localStorage
// React state --(encode)-> localStorage
export const encode = (value: PhotoFolder[]) => {
  const content: Record<string, boolean | undefined> = {};
  value.forEach((folderInfo) => {
    content[folderInfo.folderId] = folderInfo.visible;
  });
  return JSON.stringify(content);
};
// Decode the public folders content in localStorage to save to state
// localStorage --(decode)-> React state
// 原 JS：JSON.parse(getItem(...))，key 不存在时 getItem 返回 null、JSON.parse(null) 解析为 null
export const decode = (): Record<string, boolean> | null => {
  return JSON.parse(localStorage.getItem(localStorageKeyPublicFolders) ?? 'null');
};

interface FolderListProps {
  folders: PhotoFolder[];
}

function FolderList(props: FolderListProps) {
  // Whether to show photos in the private folder.
  const [privateFolderVisible, setPrivateFolderVisible] = useState(true);
  // The folder id, name and visible of public folders.
  // The key is folder ID from https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing
  // [
  //   {folderId:"13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr",visible:true,name:"Dog Photos"}
  // ]
  const [publicFolders, setPublicFolders] = useState<PhotoFolder[]>([]);

  const addFolderSubscriber = useCallback(
    (msg: any, folderInfo: PhotoFolder) => {
      // Add the new folder to the publicFolders state and save to localStorage
      const newPublicFolders = [...publicFolders, folderInfo];
      setPublicFolders(newPublicFolders);
      localStorage.setItem(
        localStorageKeyPublicFolders,
        encode(newPublicFolders)
      );
    },
    [publicFolders]
  );

  // only run once
  // useCallback to make sure the `addFolderSubscriber` function is the same instance
  useEffect(() => {
    const token = PubSub.subscribe(
      ADD_PUBLIC_FOLDER_TOPIC,
      addFolderSubscriber
    );

    // Load state from localStorage
    setPrivateFolderVisible(
      localStorage.getItem(localStorageKeyPrivateFolderVisible) === 'true'
    );

    return () => {
      PubSub.unsubscribe(token);
    };
  }, [addFolderSubscriber]);

  // turn on/off the visible of private folder
  // antd v5 的 Checkbox onChange 事件类型是 CheckboxChangeEvent（不是 React.ChangeEvent）
  const handlePrivateFolderCheckboxChange = (
    event: CheckboxChangeEvent
  ) => {
    const { checked } = event.target;
    updatePrivateFolderVisible(checked);
    PubSub.publish(checked ? SHOW_MARKERS_TOPIC : HIDE_MARKERS_TOPIC, {
      folderId: PRIVATE_FOLDER_ID,
    });
  };

  const updatePrivateFolderVisible = (visible: boolean) => {
    setPrivateFolderVisible(visible);
    // 保持原 JS 行为：localStorage.setItem 会把 boolean 强转成 "true"/"false" 字符串
    localStorage.setItem(localStorageKeyPrivateFolderVisible, String(visible));
  };

  const updatePublicFolderVisiable = (folderId: string, visible: boolean) => {
    const newState = publicFolders.map((folderInfo) => {
      if (folderInfo.folderId === folderId) {
        return { ...folderInfo, visible };
      }
      return folderInfo;
    });
    setPublicFolders(newState);
    localStorage.setItem(localStorageKeyPublicFolders, encode(newState));
  };

  const updateMarkersVisible = (visible: boolean, folderId: string) => {
    PubSub.publish(visible ? SHOW_MARKERS_TOPIC : HIDE_MARKERS_TOPIC, {
      folderId,
    });
  };

  const removePublicFolder = (folderId: string) => {
    const newState = publicFolders.filter(
      (folderInfo) => folderInfo.folderId !== folderId
    );
    setPublicFolders(newState);
    localStorage.setItem(localStorageKeyPublicFolders, encode(newState));
  };

  const removeMarkersInFolder = (folderId: string) => {
    PubSub.publish(REMOVE_MARKERS_IN_FOLDER_TOPIC, {
      folderId,
    });
  };

  const getPhotoCountInFolder = (folderId: string) => {
    let photoCountInFolder: string = 'Unknown count';
    const folder = props.folders.find((folder) => folder.folderId === folderId);
    if (folder) {
      photoCountInFolder = folder.files.length + '';
    }
    return photoCountInFolder;
  };

  const renderPublicFolders = () => {
    if (publicFolders.length === 0) {
      return 'No data';
    }

    return publicFolders.map(renderPublicFolder);
  };

  const renderPublicFolder = (folderInfo: PhotoFolder) => {
    const { folderId } = folderInfo;
    const handleChange = (event: CheckboxChangeEvent) => {
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
            <Button size='small' danger>
              Del
            </Button>
          </Popconfirm>
        </Checkbox>
      </div>
    );
  };

  return (
    <div>
      <div>
        <h3>Private folder in Google Drive</h3>
        <Checkbox
          checked={privateFolderVisible}
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
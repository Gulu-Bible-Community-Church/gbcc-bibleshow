// import { sha256sum } from './nodeCrypto.js';
// import { versions } from './versions.js';
// import { ipcRenderer } from 'electron';

// /**
//  * General IPC send function
//  */
// function send(channel: string, message: string) {
//   return ipcRenderer.invoke(channel, message);
// }

// /**
//  * Window management functions
//  */
// function openSecondaryWindow() {
//   console.log('Preload: Attempting to open secondary window');
//   return ipcRenderer.invoke('open-secondary-window');
// }

// function sendToSecondary(data: unknown) {
//   console.log('Preload: Attempting to send data to secondary window:', data);
//   return ipcRenderer.invoke('send-to-secondary', data);
// }

// function onDisplayContent(callback: (data: unknown) => void) {
//   console.log('Preload: Setting up display content listener');
//   ipcRenderer.on('display-content', (_event, data) => {
//     console.log('Preload: Received display content:', data);
//     callback(data);
//   });
// }

// function removeDisplayContentListener() {
//   console.log('Preload: Removing display content listener');
//   ipcRenderer.removeAllListeners('display-content');
// }

// // Export all functions
// export {
//   sha256sum,
//   versions,
//   send,
//   openSecondaryWindow,
//   sendToSecondary,
//   onDisplayContent,
//   removeDisplayContentListener,
// };

import { contextBridge, ipcRenderer } from 'electron';

// Define the type for the API exposed to the renderer process
interface ElectronAPI {
  openSecondaryWindow: () => Promise<void>;
  sendToSecondary: (data: unknown) => Promise<void>;
  onDisplayContent: (callback: (data: unknown) => void) => void;
  removeDisplayContentListener: () => void;
}

// Implement the API
const electronAPI: ElectronAPI = {
  openSecondaryWindow: () => ipcRenderer.invoke('open-secondary-window'),
  sendToSecondary: (data) => ipcRenderer.invoke('send-to-secondary', data),
  onDisplayContent: (callback) => {
    ipcRenderer.on('display-content', (_event, data) => callback(data));
  },
  removeDisplayContentListener: () => {
    ipcRenderer.removeAllListeners('display-content');
  },
};


// Expose the API in the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


import { contextBridge, ipcRenderer } from 'electron';

// Define the type for the API exposed to the renderer process
interface ElectronAPI {
  openSecondaryWindow: () => Promise<void>;
  sendToSecondary: (data: unknown) => Promise<void>;
  closeSecondaryWindow: () => Promise<boolean>; 
  onDisplayContent: (callback: (data: unknown) => void) => void;
  removeDisplayContentListener: () => void;
}

// Implement the API
const electronAPI: ElectronAPI = {
  openSecondaryWindow: () => ipcRenderer.invoke('open-secondary-window'),
  sendToSecondary: (data) => ipcRenderer.invoke('send-to-secondary', data),
  closeSecondaryWindow: () => ipcRenderer.invoke('close-secondary-window'),
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
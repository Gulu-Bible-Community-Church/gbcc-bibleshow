import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';

// Define the type for the API exposed to the renderer process
interface ElectronAPI {
  openSecondaryWindow: () => Promise<void>;
  sendToSecondary: (data: unknown) => Promise<void>;
  closeSecondaryWindow: () => Promise<boolean>; 
  onDisplayContent: (callback: (data: unknown) => void) => void;
  removeDisplayContentListener: () => void;
  // Add new presentation methods
  readPresentations: () => Promise<any[]>;
  savePresentations: (presentations: any[]) => Promise<boolean>;
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

  // Add presentation file operations
  readPresentations: async () => {
    try {
      const userDataPath = await ipcRenderer.invoke('get-user-data-path');
      const filePath = path.join(userDataPath, 'presentations.json');
      
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({ presentations: [] }, null, 2));
      }
      
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data.presentations;
    } catch (error) {
      console.error('Error reading presentations:', error);
      return [];
    }
  },

  savePresentations: async (presentations) => {
    console.log('Saving presentations:', presentations);
    try {
      const userDataPath = await ipcRenderer.invoke('get-user-data-path');
      console.log('Saving presentations to:', userDataPath);
      const filePath = path.join(userDataPath, 'presentations.json');
      console.log('Saving presentations to:', filePath);
      fs.writeFileSync(filePath, JSON.stringify({ presentations }, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving presentations:', error);
      return false;
    }
  }
};

// Expose the API in the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
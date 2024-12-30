interface ElectronAPI {
	openSecondaryWindow: () => Promise<void>;
	sendToSecondary: (data: unknown) => Promise<void>;
	closeSecondaryWindow: () => Promise<boolean>; 
	onDisplayContent: (callback: (data: unknown) => void) => void;
  }
  
  declare global {
	interface Window {
	  electronAPI: ElectronAPI;
	}
  }
  
  export {};
  
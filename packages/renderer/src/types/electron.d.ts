interface ElectronAPI {
	openSecondaryWindow: () => Promise<void>;
	sendToSecondary: (data: unknown) => Promise<void>;
	onDisplayContent: (callback: (data: unknown) => void) => void;
  }
  
  declare global {
	interface Window {
	  electronAPI: ElectronAPI;
	}
  }
  
  export {};
  
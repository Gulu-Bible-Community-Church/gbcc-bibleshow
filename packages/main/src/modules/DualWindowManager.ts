// packages/main/src/modules/DualWindowManager.ts
import type {AppModule} from '../AppModule.js';
import type {ModuleContext} from '../ModuleContext.js';
import type {AppInitConfig} from '../AppInitConfig.js';
import {app, BrowserWindow, ipcMain} from 'electron';

interface WindowConfig {
  width: number;
  height: number;
  title: string;
}

export interface DualWindowManagerConfig {
  initConfig: AppInitConfig;
  openDevTools?: boolean;
  windowConfig?: {
    main?: Partial<WindowConfig>;
    secondary?: Partial<WindowConfig>;
  };
}

class DualWindowManager implements AppModule {
  #mainWindow: BrowserWindow | null = null;
  #secondaryWindow: BrowserWindow | null = null;
  readonly #config: DualWindowManagerConfig;

  readonly #defaultMainConfig: WindowConfig = {
    width: 800,
    height: 600,
    title: 'Main Window'
  };

  readonly #defaultSecondaryConfig: WindowConfig = {
    width: 600,
    height: 800,
    title: 'Secondary Window'
  };

  constructor(config: DualWindowManagerConfig) {
    this.#config = config;
  }

  async enable({app}: ModuleContext): Promise<void> {
    console.log('DualWindowManager: Enabling module');
    await app.whenReady();
    
    const mainConfig = this.#getMainWindowConfig();
    console.log('DualWindowManager: Creating main window with config:', mainConfig);
    this.#createMainWindow(mainConfig);

    app.on('activate', () => {
      console.log('DualWindowManager: App activated');
      if (BrowserWindow.getAllWindows().length === 0) {
        this.#createMainWindow(mainConfig);
      }
    });

    this.#setupIPC();
  }

  // #setupIPC(): void {
  //   console.log('DualWindowManager: Setting up IPC handlers');
  //   // Handle opening secondary window
  //   ipcMain.handle('open-secondary-window', () => {
  //     const secondaryConfig = this.#getSecondaryWindowConfig();
  //     this.#createSecondaryWindow(secondaryConfig);
  //   });

  //   // Handle sending data to secondary window
  //   ipcMain.handle('send-to-secondary', (_event, data: unknown) => {
  //     console.log('DualWindowManager: Received data to send to secondary:', data);
      
  //     if (!this.#secondaryWindow) {
  //       console.log('DualWindowManager: Secondary window not found, creating new one');
  //       const secondaryConfig = this.#getSecondaryWindowConfig();
  //       this.#createSecondaryWindow(secondaryConfig);
        
  //       this.#secondaryWindow!.webContents.once('did-finish-load', () => {
  //         console.log('DualWindowManager: Secondary window loaded, sending data');
  //         this.#secondaryWindow?.webContents.send('display-content', data);
  //       });
  //     } else {
  //       console.log('DualWindowManager: Sending data to existing secondary window');
  //       this.#secondaryWindow.webContents.send('display-content', data);
  //     }
  //   });
  // }
  #setupIPC() {
    console.log('DualWindowManager: Setting up IPC handlers');
  
    ipcMain.handle('open-secondary-window', () => {
      const secondaryConfig = this.#getSecondaryWindowConfig();
      this.#createSecondaryWindow(secondaryConfig);
    });
  
    ipcMain.handle('send-to-secondary', (_event, data) => {
      console.log('DualWindowManager: Received data for secondary:', data);
  
      if (!this.#secondaryWindow) {
        console.log('DualWindowManager: Secondary window not found, creating new one');
        const secondaryConfig = this.#getSecondaryWindowConfig();
        this.#createSecondaryWindow(secondaryConfig);
  
        // this.#secondaryWindow.webContents.once('did-finish-load', () => {
        //   this.#secondaryWindow.webContents.send('display-content', data);
        // });
      } else {
        this.#secondaryWindow.webContents.send('display-content', data);
      }
    });
  }
  

  #getMainWindowConfig(): WindowConfig {
    return {
      ...this.#defaultMainConfig,
      ...this.#config.windowConfig?.main
    };
  }

  #getSecondaryWindowConfig(): WindowConfig {
    return {
      ...this.#defaultSecondaryConfig,
      ...this.#config.windowConfig?.secondary
    };
  }

  #createMainWindow(config: WindowConfig): void {
    console.log('DualWindowManager: Creating main window');
    this.#mainWindow = new BrowserWindow({
      width: config.width,
      height: config.height,
      title: config.title,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: this.#config.initConfig.preload.path,
      },
    });

    if (this.#config.openDevTools) {
      this.#mainWindow.webContents.openDevTools();
    }

    if (this.#config.initConfig.renderer instanceof URL) {
      this.#mainWindow.loadURL(this.#config.initConfig.renderer.toString());
    } else {
      this.#mainWindow.loadFile(this.#config.initConfig.renderer.path);
    }

    this.#mainWindow.on('closed', () => {
      console.log('DualWindowManager: Main window closed');
      this.#mainWindow = null;
    });
  }

  #createSecondaryWindow(config: WindowConfig): void {
    if (this.#secondaryWindow) {
      console.log('DualWindowManager: Secondary window exists, focusing');
      this.#secondaryWindow.focus();
      return;
    }

    console.log('DualWindowManager: Creating secondary window');

    this.#secondaryWindow = new BrowserWindow({
      width: config.width,
      height: config.height,
      title: config.title,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: this.#config.initConfig.preload.path,
      },
    });

    if (this.#config.openDevTools) {
      this.#secondaryWindow.webContents.openDevTools();
    }

    if (this.#config.initConfig.renderer instanceof URL) {
      const secondaryUrl = new URL('/secondary', this.#config.initConfig.renderer);
      this.#secondaryWindow.loadURL(secondaryUrl.toString());
    } else {
      const secondaryPath = this.#config.initConfig.renderer.path.replace('index.html', 'secondary.html');
      this.#secondaryWindow.loadFile(secondaryPath);
    }

    this.#secondaryWindow.on('closed', () => {
      console.log('DualWindowManager: Secondary window closed');
      this.#secondaryWindow = null;
    });
  }
}

export function createDualWindowManagerModule(config: DualWindowManagerConfig): AppModule {
  return new DualWindowManager(config);
}
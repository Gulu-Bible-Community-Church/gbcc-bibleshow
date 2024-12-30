import type {AppModule} from '../AppModule.js';
import type {ModuleContext} from '../ModuleContext.js';
import type {AppInitConfig} from '../AppInitConfig.js';
import {app, BrowserWindow, ipcMain, screen} from 'electron';

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
    width: 1024, // Increased from 800
    height: 768, // Increased from 600
    title: 'Main Window'
  };

  readonly #defaultSecondaryConfig: WindowConfig = {
    width: 1920, // Set to common full HD width
    height: 1080, // Set to common full HD height
    title: 'Secondary Window'
  };

  constructor(config: DualWindowManagerConfig) {
    this.#config = config;
  }

  #getExternalDisplay() {
    const displays = screen.getAllDisplays();
    const primaryDisplay = screen.getPrimaryDisplay();
    return displays.find(display => display.id !== primaryDisplay.id);
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

  #setupIPC() {
    console.log('DualWindowManager: Setting up IPC handlers');
  
    ipcMain.handle('open-secondary-window', () => {
      const externalDisplay = this.#getExternalDisplay();
      if (!externalDisplay) {
        console.error('No external display detected');
        // Send error to main window
        this.#mainWindow?.webContents.send('display-error', 'No external display detected');
        return false;
      }

      const secondaryConfig = this.#getSecondaryWindowConfig();
      this.#createSecondaryWindow(secondaryConfig, externalDisplay);
      return true;
    });
  
    ipcMain.handle('send-to-secondary', (_event, data) => {
      console.log('DualWindowManager: Received data for secondary:', data);
  
      if (!this.#secondaryWindow) {
        const externalDisplay = this.#getExternalDisplay();
        if (!externalDisplay) {
          console.error('No external display detected');
          this.#mainWindow?.webContents.send('display-error', 'No external display detected');
          return false;
        }

        console.log('DualWindowManager: Secondary window not found, creating new one');
        const secondaryConfig = this.#getSecondaryWindowConfig();
        this.#createSecondaryWindow(secondaryConfig, externalDisplay);
      }
      
      this.#secondaryWindow?.webContents.send('display-content', data);
      return true;
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
      minWidth: 800, // Add minimum size constraints
      minHeight: 600,
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

  #createSecondaryWindow(config: WindowConfig, externalDisplay: Electron.Display): void {
    if (this.#secondaryWindow) {
      console.log('DualWindowManager: Secondary window exists, focusing');
      this.#secondaryWindow.focus();
      return;
    }

    console.log('DualWindowManager: Creating secondary window on external display');

    this.#secondaryWindow = new BrowserWindow({
      width: externalDisplay.size.width,
      height: externalDisplay.size.height,
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
      title: config.title,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: this.#config.initConfig.preload.path,
      },
      fullscreen: true, // Make it fullscreen by default
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
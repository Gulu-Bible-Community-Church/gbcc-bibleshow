import { app, Menu, BrowserWindow, shell, dialog } from 'electron';

export class MenuBuilder {
	mainWindow: BrowserWindow;
	appName: string = 'Bible Show';

	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;
	}

	buildMenu(): Menu {
		if (process.env.NODE_ENV === 'development') {
			this.setupDevelopmentEnvironment();
		}

		const template = this.buildTemplate();
		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);

		return menu;
	}

	setupDevelopmentEnvironment(): void {
		this.mainWindow.webContents.on('context-menu', (_, props) => {
			const { x, y } = props;
			Menu.buildFromTemplate([
				{
					label: 'Inspect Element',
					click: () => {
						this.mainWindow.webContents.inspectElement(x, y);
					},
				},
			]).popup({ window: this.mainWindow });
		});
	}

	buildTemplate(): Electron.MenuItemConstructorOptions[] {
		const template: Electron.MenuItemConstructorOptions[] = [
			{
				label: this.appName,
				submenu: [
					{
						label: 'About',
						click: () => {
							dialog.showMessageBox(this.mainWindow, {
								title: 'About',
								message: `${this.appName} v1.0.0`,
								detail: 'A Bible presentation application',
								buttons: ['OK'],
								type: 'info',
							});
						},
					},
					{ type: 'separator' },
					{
						label: 'Quit',
						accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
						click: () => {
							app.quit();
						},
					},
				],
			},
			// {
			// 	label: 'File',
			// 	submenu: [
			// 		{
			// 			label: 'New Window',
			// 			accelerator: 'CmdOrCtrl+N',
			// 			click: () => {
			// 				// Handle new window creation
			// 			},
			// 		},
			// 		{ type: 'separator' },
			// 		{
			// 			label: 'Close Window',
			// 			accelerator: 'CmdOrCtrl+W',
			// 			click: () => {
			// 				this.mainWindow.close();
			// 			},
			// 		},
			// 	],
			// },
			// {
			// 	label: 'Edit',
			// 	submenu: [
			// 		{
			// 			label: 'Undo',
			// 			accelerator: 'CmdOrCtrl+Z',
			// 			role: 'undo',
			// 		},
			// 		{
			// 			label: 'Redo',
			// 			accelerator: 'Shift+CmdOrCtrl+Z',
			// 			role: 'redo',
			// 		},
			// 		{ type: 'separator' },
			// 		{
			// 			label: 'Cut',
			// 			accelerator: 'CmdOrCtrl+X',
			// 			role: 'cut',
			// 		},
			// 		{
			// 			label: 'Copy',
			// 			accelerator: 'CmdOrCtrl+C',
			// 			role: 'copy',
			// 		},
			// 		{
			// 			label: 'Paste',
			// 			accelerator: 'CmdOrCtrl+V',
			// 			role: 'paste',
			// 		},
			// 		{ type: 'separator' },
			// 		{
			// 			label: 'Select All',
			// 			accelerator: 'CmdOrCtrl+A',
			// 			role: 'selectAll',
			// 		},
			// 	],
			// },
			// {
			// 	label: 'View',
			// 	submenu: [
			// 		{
			// 			label: 'Reload',
			// 			accelerator: 'CmdOrCtrl+R',
			// 			click: () => {
			// 				this.mainWindow.webContents.reload();
			// 			},
			// 		},
			// 		{
			// 			label: 'Toggle Full Screen',
			// 			accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
			// 			click: () => {
			// 				this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
			// 			},
			// 		},
			// 		{
			// 			label: 'Toggle Developer Tools',
			// 			accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
			// 			click: () => {
			// 				this.mainWindow.webContents.toggleDevTools();
			// 			},
			// 		},
			// 		{ type: 'separator' },
			// 		{
			// 			label: 'Reset Zoom',
			// 			accelerator: 'CmdOrCtrl+0',
			// 			click: () => {
			// 				this.mainWindow.webContents.setZoomLevel(0);
			// 			},
			// 		},
			// 		{
			// 			label: 'Zoom In',
			// 			accelerator: 'CmdOrCtrl+Plus',
			// 			click: () => {
			// 				const zoomLevel = this.mainWindow.webContents.getZoomLevel();
			// 				this.mainWindow.webContents.setZoomLevel(zoomLevel + 0.5);
			// 			},
			// 		},
			// 		{
			// 			label: 'Zoom Out',
			// 			accelerator: 'CmdOrCtrl+-',
			// 			click: () => {
			// 				const zoomLevel = this.mainWindow.webContents.getZoomLevel();
			// 				this.mainWindow.webContents.setZoomLevel(zoomLevel - 0.5);
			// 			},
			// 		},
			// 	],
			// },
			// {
			// 	label: 'Window',
			// 	submenu: [
			// 		{
			// 			label: 'Minimize',
			// 			accelerator: 'CmdOrCtrl+M',
			// 			role: 'minimize',
			// 		},
			// 		{
			// 			label: 'Close',
			// 			accelerator: 'CmdOrCtrl+W',
			// 			role: 'close',
			// 		},
			// 	],
			// },
			// {
			// 	label: 'Help',
			// 	submenu: [
			// 		{
			// 			label: 'Learn More',
			// 			click: async () => {
			// 				await shell.openExternal('https://electronjs.org');
			// 			},
			// 		},
			// 		{
			// 			label: 'Documentation',
			// 			click: async () => {
			// 				await shell.openExternal('https://electronjs.org/docs');
			// 			},
			// 		},
			// 	],
			// },
		];

		// We don't need the macOS-specific menu anymore since we already have the app menu
		// as the first item for all platforms
		// if (process.platform === 'darwin') {
		// 	template.unshift({
		// 		label: this.appName, // Updated to use appName instead of app.name
		// 		submenu: [
		// 			{ role: 'about' },
		// 			{ type: 'separator' },
		// 			{ role: 'services' },
		// 			{ type: 'separator' },
		// 			{ role: 'hide' },
		// 			{ role: 'hideOthers' },
		// 			{ role: 'unhide' },
		// 			{ type: 'separator' },
		// 			{ role: 'quit' },
		// 		],
		// 	});
		// }


		return template;
	}
}
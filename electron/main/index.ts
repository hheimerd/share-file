import {app, BrowserWindow, shell, ipcMain, dialog, type WebContents} from 'electron';
import {join} from 'node:path';
import fs from 'fs/promises';
import {Action, FileWatcher} from './file-watcher';
import type {Subscription} from 'rxjs';
import {v4 as uuid} from 'uuid';
import {sleep} from './sleep';
import {setAttributesSync} from 'fswin';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

app.disableHardwareAcceleration();

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      experimentalFeatures: true,
      v8CacheOptions: 'bypassHeatCheckAndEagerCompile',
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({url}) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return {action: 'deny'};
  });
}

app.whenReady().then(async () => {
  await createWindow();
  ipcMain.on('open-dir-selector', async () => {
    const {filePaths, canceled} = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Save file to',
      buttonLabel: 'Save',
    });

    win?.webContents.send('dir-selected', canceled ? null : filePaths[0]);
  });

  ipcMain.on('start-file-drag', async (e) => {

    const path = await dropFile(e.sender);

    win?.webContents.send('file-dropped', path);
  });
});

const appPath = app.getAppPath();
const resourcesRoot = appPath.endsWith('asar') ? join(appPath, '..') :  join(appPath, 'resources');

async function dropFile(webContents: WebContents): Promise<string | undefined> {
  const uuidExt = uuid().slice(0, 8);
  const watcher = new FileWatcher(`*.${uuidExt}`);
  watcher.start();

  const tempFileName = `.temp.${uuidExt}`;
  const tempFilePath = join(resourcesRoot, tempFileName);
  await fs.writeFile(tempFilePath, '');
  setAttributesSync(tempFilePath, {IS_TEMPORARY: true, IS_HIDDEN: true});

  let sub: Subscription;

  const receivedPath = new Promise<string>((resolve) => {
    sub = watcher.fileChange.subscribe(e => {
      if (e.action == Action.Changed) {
        resolve(e.path);
      }
    });
  });

  await sleep(200);

  webContents.startDrag({
    file: tempFilePath,
    icon: join(resourcesRoot, 'documents.png'),
  });

  const path = await Promise.race([
    sleep(2000).then(() => false as const),
    receivedPath
  ]);

  sub?.unsubscribe();
  watcher.dispose();

  if (path)
    await fs.unlink(path);
  await fs.unlink(tempFilePath);

  return path ? path.slice(0, path.length - tempFileName.length) : undefined;
}

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, {hash: arg});
  }
});

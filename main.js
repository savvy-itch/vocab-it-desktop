import { session } from 'electron';
import { app, BrowserWindow } from 'electron/main';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Not allowed to load local resource: 
// file:///D:/Web_Projects/Projects/React/vocab-it-desktop/out/vocab-it-desktop-win32-x64/resources/app.asar/file:/D:/Web_Projects/Projects/React/vocab-it-desktop/out/vocab-it-desktop-win32-x64/resources/app.asar/build/client/index.html

// file:///C:/Users/Lenovo/AppData/Local/vocab_it_desktop/app-1.0.0/resources/app.asar/file:/C:/Users/Lenovo/AppData/Local/vocab_it_desktop/app-1.0.0/resources/app.asar/build/client/index.html

console.log('running the app...');

const createWindow = () => {
  console.log('Creating browser window...');
  const win = new BrowserWindow({
    width: 900,
    height: 650,
    webPreferences: {
      nodeIntegration: false,
    },
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin'
      ? {titleBarOverlay: true}
      : {}
    ),
    icon: 'images/vocab-it.ico'
  });

  win.webContents.openDevTools();
  const appPath = pathToFileURL(path.join(__dirname, 'build', 'client', 'index.html')).toString();
  console.log(appPath);
  win.loadFile(path.join(__dirname, 'build', 'client', 'index.html'));
  // win.loadURL(`http://localhost:3000/`);
}

app.removeAllListeners('ready');
app.whenReady().then(() => {
  console.log('app is ready...');

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'"]
      }
    })
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

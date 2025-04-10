import { session } from 'electron';
import { app, BrowserWindow } from 'electron/main';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 950,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
    },
    titleBarStyle: 'hidden',
    ...(process.platform !== 'darwin'
      ? {titleBarOverlay: true}
      : {}
    ),
    icon: path.join(__dirname, 'dist/images/AppList.targetsize-96.png')
  });

  // win.webContents.openDevTools();
  win.loadFile(path.join(__dirname, './dist', 'index.html'));
}

app.removeAllListeners('ready');
app.whenReady().then(() => {

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

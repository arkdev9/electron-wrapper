require('dotenv').config()
const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')

var win
function createWindow () {
  win = new BrowserWindow({
    width: 1024,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify()
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000/dev')
  } else {
    win.loadFile('build/index.html')
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

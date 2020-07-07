require('dotenv').config()
const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')

var win
function createWindow () {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify()
  })

  win.loadFile('build/index.html')
  // win.loadURL('http://localhost:3000/')

  win.webContents.openDevTools()
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

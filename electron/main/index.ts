// The built directory structure
//
// ├─┬ dist
// │ ├─┬ electron
// │ │ ├─┬ main
// │ │ │ └── index.js
// │ │ └─┬ preload
// │ │   └── index.js
// │ ├── index.html
// │ ├── ...other-static-files-from-public
// │
process.env.DIST = join(__dirname, '../..')
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST, '../public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  globalShortcut,
  Tray,
  Menu,
  screen
} from 'electron'
import { release } from 'os'
import { join } from 'path'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../utils/constants'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  const { x, y } = getInitialWindowPosition()

  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.svg'),
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x,
    y,
    webPreferences: {
      preload,
      nodeIntegration: true
    },
    titleBarStyle: 'hiddenInset',
    frame: false,
    skipTaskbar: true,
    transparent: true,
    show: false
  })

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    win.webContents.openDevTools({ mode: 'detach' })
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  //Hide the window when it loses focus
  win.on('blur', () => {
    win.hide()
  })

  // Shortcuts
  registerShortcuts(win)

  // Tray
  setupTray()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload
    }
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})

function registerShortcuts(mainWindow: BrowserWindow) {
  globalShortcut.register('esc', () => {
    if (BrowserWindow.getFocusedWindow() !== null) {
      mainWindow.hide()
    }
  })

  globalShortcut.register('CommandOrControl+shift+f', () => {
    mainWindow.show()
    mainWindow.focus()
  })
}

function setupTray() {
  const tray = new Tray('src/assets/favicon.ico')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: () => {
        //TODO: Open settings window
      }
    },
    {
      label: 'Exit',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('QuickLook search manager')
  tray.setContextMenu(contextMenu)
}

function getInitialWindowPosition(): { x: number; y: number } {
  const bounds = screen.getPrimaryDisplay().bounds
  const x = bounds.x + (bounds.width - WINDOW_WIDTH) / 2
  const y = bounds.y + (bounds.height - WINDOW_HEIGHT) / 4
  return { x, y }
}

/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import closeSysd from './utils/close-sysd'
import MenuBuilder from './menu'

const favicon = join(__dirname, 'favicon.ico')

let mainWindow = null
let splashWindow = null
let consoleWindow = null

if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')()
  const path = require('path')
  const p = path.join(__dirname, '..', 'app', 'node_modules')
  require('module').globalPaths.push(p)
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log)
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  closeSysd()

  setTimeout(() => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }, 1500)
})

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions()
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 600,
    frame: false,
    transparent: true,
    resizable: true,
    minWidth: 824,
    minHeight: 429,
    icon: favicon
  })

  splashWindow = new BrowserWindow({
    show: false,
    width: 400,
    height: 500,
    frame: false,
    transparent: true,
    resizable: false,
    icon: favicon
  })

  consoleWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 600,
    frame: true,
    transparent: true,
    resizable: true,
    icon: favicon
  })

  splashWindow.loadURL(`file://${__dirname}/splash.html`)
  consoleWindow.loadURL(`file://${__dirname}/console.html`)

  splashWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }

    if (splashWindow) {
      splashWindow.show()
      splashWindow.focus()
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }

    mainWindow.show()
    mainWindow.focus()
  
    if (!splashWindow.isDestroyed()) {
      splashWindow.close()
    }
  })

  mainWindow.on('maximize', () => {
    if (mainWindow) {
      mainWindow.webContents.send('maximize')
    }
  })

  mainWindow.on('unmaximize', () => {
    if (mainWindow) {
      mainWindow.webContents.send('unmaximize')
    }
  })

  mainWindow.on('close', ev => {
    ev.preventDefault()

    if (!mainWindow.isDestroyed()) {
      mainWindow.destroy()
    }
    if (!consoleWindow.isDestroyed()) {
      consoleWindow.destroy()
    }
  })

  consoleWindow.on('close', ev => {
    ev.preventDefault()
    consoleWindow.hide()
  })

  // IPC Events

  ipcMain.on('start-success', () => {
    // If startup went well, start loading the app.
    if (mainWindow) {
      mainWindow.loadURL(`file://${__dirname}/app.html`)
    }
  })

  ipcMain.on('minimize', () => {
    // Minimize the window
    if (mainWindow) {
      mainWindow.minimize()
    }
  })

  ipcMain.on('close', () => {
    // Closes the app
    if (!mainWindow.isDestroyed()) {
      mainWindow.destroy()
    }
    if (!consoleWindow.isDestroyed()) {
      consoleWindow.destroy()
    }
  })

  ipcMain.on('maximize', (e) => {
    // Maximize the window
    if (mainWindow) {
      mainWindow.maximize()
    }
    e.sender.send('maximize')
  })

  ipcMain.on('unmaximize', (e) => {
    // Unmaximize the window
    if (mainWindow) {
      mainWindow.unmaximize()
    }
    e.sender.send('unmaximize')
  })

  ipcMain.on('toggle-console', () => {
    if (consoleWindow.isVisible()) {
      return consoleWindow.hide()
    }
    consoleWindow.show()
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()
})

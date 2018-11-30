import { remote, ipcRenderer } from 'electron'
import getEnv from 'fw-utils/get-env'
import closeSysd from 'fw-utils/close-sysd'

const isProd = getEnv() === 'production'

export default () => {
  // Attaches listeners to window object

  window.onbeforeunload = async () => {
    global.appStorage.eraseAll()
  
    if (isProd) {
      closeSysd()
    }

    remote.app.exit()
  }

  window.onkeydown = e => {
    if (e.keyCode === 121) {
      ipcRenderer.send('toggle-console')
    }
  }

}

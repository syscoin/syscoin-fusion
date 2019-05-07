import { ipcRenderer } from 'electron'

export default () => {
  // Attaches listeners to window object

  window.onbeforeunload = () => {
    global.appStorage.eraseAll()
  }

  window.onkeydown = e => {
    if (e.keyCode === 121) {
      ipcRenderer.send('toggle-console')
    }
  }

}

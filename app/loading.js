import splashSrc from './splash.png'

const SplashImage = new Image

SplashImage.onload = () => {
    document.querySelectorAll('.splash-img')[0].src = SplashImage.src
}

SplashImage.src = splashSrc

const Storage = require('./utils/storage')
const storageSchema = require('./utils/helpers/storage-schema')
const { ipcRenderer } = require('electron')

global.appStorage = new Storage({
    configName: 'app-storage',
    defaults: {...storageSchema}
  })

const startUpRoutine = require('./utils/startup')

startUpRoutine(err => {
    if (err) {
        return
    }

    ipcRenderer.send('start-success')
})
import SplashImage from './splash.png'

const Storage = require('./utils/storage')
const storageSchema = require('./utils/helpers/storage-schema')
const pushToLogs = require('./utils/push-to-logs')

// Log all errors to debug.log
window.onerror = err => pushToLogs(err)

global.appStorage = new Storage({
    configName: 'app-storage',
    defaults: {...storageSchema}
  })

const startUpRoutine = require('./utils/startup')

if (process.env.NODE_ENV === 'development') {
    document.querySelector('.dev-mode').innerHTML = 'DEV MODE'
}

startUpRoutine(() => {
    const splashScreenUrl = global.appStorage.get('splashscreen_url')
    const progressBarColor = global.appStorage.get('progress_bar_color')
    const splashImage = new Image

    splashImage.onload = () => {
        document.querySelectorAll('.splash-img')[0].src = splashImage.src
    }

    if (splashScreenUrl) {
        splashImage.src = splashScreenUrl
    } else {
        splashImage.src = SplashImage
    }

    if (progressBarColor) {
        document.querySelector('.progress').style.background = progressBarColor
    }
})

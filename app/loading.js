import SplashImage from './splash.png'

const splashImage = new Image

splashImage.onload = () => {
    document.querySelectorAll('.splash-img')[0].src = splashImage.src
}

splashImage.src = SplashImage

const Storage = require('./utils/storage')
const storageSchema = require('./utils/helpers/storage-schema')


global.appStorage = new Storage({
    configName: 'app-storage',
    defaults: {...storageSchema}
  })

const startUpRoutine = require('./utils/startup')

startUpRoutine(err => console.log(err))
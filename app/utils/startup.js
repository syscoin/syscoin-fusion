const { exec } = require('child_process')
const { app } = require('electron').remote
const { ipcRenderer } = require('electron')
const fs = require('fs')
const swal = require('sweetalert')
const waterfall = require('async/waterfall')

const loadConfIntoStore = require('./load-conf-into-dev')
const generateCmd = require('./cmd-gen')
const getPaths = require('./get-doc-paths')
const getSysPath = require('./syspath')

const checkSyscoind = (cb) => {
  // Just a test to check if syscoind is ready
  exec(generateCmd('cli', 'getinfo'), (err, stdout) => {
    if (err) {
      if (err.message.indexOf('code: -28') !== -1) {
        // Verifying wallet... Let the user know.
        return cb(null, 'verify', err.message)
      }
      cb(err)
      return
    }

    let output

    // Tries to parse the output of getinfo. If it's successful, it means that syscoind is working.
    try {
      output = JSON.parse(stdout)
    } catch (error) {
      cb(error)
      return
    }

    // isUp, getinfo output
    cb(false, 'up', output)
  })
}

const checkAndCreateDocFolder = ({ customCssPath, appDocsPath, confPath }) => {
  const docs = require('./helpers/css-custom-template') // eslint-disable-line global-require

  if (!fs.existsSync(appDocsPath)) {
    // If docs path doesnt exist, try to create it.
    try {
      fs.mkdirSync(appDocsPath)

      // Attemps to copy custom files
      fs.writeFileSync(
        customCssPath,
        docs.css
      )
    } catch (e) {
      // Show an alert if an error comes up
      return swal('Error', 'There was an error while reading App\'s document folder', 'error')
    }
  }

  if (!fs.existsSync(customCssPath)) {
    // If cant find custom.css file, regenerate it.
    fs.writeFileSync(
      customCssPath,
      docs.css
    )
  }

  if (!fs.existsSync(confPath)) {
    // If cant find fusion.cfg file, regenerate it.
    fs.writeFileSync(
      confPath,
      docs.cfg
    )
  }
}

const startUpRoutine = () => {
  let isFirstTime

  if (!fs.existsSync(getSysPath('default'))) {
    isFirstTime = true
    // Attemps to create SyscoinCore folder if this doesn't exists already.
    try {
      fs.mkdirSync(getSysPath('default'))
    } catch (err) {
      // Failed to create SyscoinCore folder
      swal('Error', 'Failed to create SyscoinCore folder.', 'error')
        .then(() => app.quit())
        .catch(() => app.quit())
      return
    }
  }

  const {
    appDocsPath,
    customCssPath,
    confPath
  } = getPaths()

  updateProgressbar(20)

  // Docs path initialization
  checkAndCreateDocFolder({
    appDocsPath,
    customCssPath,
    confPath
  })

  updateProgressbar(30, 'Loading custom CSS')

  // Apply custom settings
  updateProgressbar(50, 'Loading config')
  loadConfIntoStore(confPath)

  updateProgressbar(60, 'Connecting to syscoin...')

  waterfall([
    done => {
      let isDone = false
      exec(generateCmd('syscoind', `${isFirstTime ? '-reindex' : ''} -addressindex -assetallocationindex -server`), (err) => {
        if (isDone) {
          return
        }

        isDone = true
        if (err.message.indexOf('-reindex') !== -1) {
          return done(null, true)
        }

        return done(null, false)
      })
      setTimeout(() => {
        if (!isDone) {
          isDone = true
          done(null, null)
        }
      }, 10000)
    },
    (reindex, done) => {
      if (reindex) {
        return swal('Corruption detected', 'Your files dont not look quite well, reindexing.', 'warning')
          .then(() => done(null, 'reindex'))
          .catch(() => done(true))
      }

      return done(null, false)
    },
    (reindex, done) => {
      if (reindex) {
        exec(generateCmd('syscoind', '-reindex -addressindex -assetallocationindex -server'))
      }
      done()
    },
    (done) => {
      global.checkInterval = setInterval(() => {
        // Sets a checking interval that will keep pinging syscoind via syscoin-cli to check if its ready.
        checkSyscoind((error, status) => {
          if (error) {
            clearInterval(global.checkInterval)
            updateProgressbar(60, 'Something went wrong.')
            return done(error)
          }
  
          if (status === 'verify') {
            return updateProgressbar(80, 'Verifying data...')
          }
  
          if (status === 'up') {
            window.appStorage.set('firstTime', false)
            updateProgressbar(100, 'Ready to launch')
            // if its up, clear the interval.
            clearInterval(global.checkInterval)
            ipcRenderer.send('start-success')
          }
        })
      }, 3000)
    }
  ], err => {
    if (err) {
      console.log(err)
      return swal('Error', 'Something went wrong during wallet initialization. Exiting.', 'error')
        .then(() => app.quit())
    }
  })
}

function updateProgressbar(value, text) {
  document.querySelectorAll('.progress')[0].style.width = `${value}%`
  if (text) {
    // document.querySelectorAll('.progress')[0].innerHTML = text
  }
}

export default startUpRoutine

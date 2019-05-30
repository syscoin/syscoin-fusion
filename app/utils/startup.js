const { exec } = require('child_process')
const { app } = require('electron').remote
const { ipcRenderer } = require('electron')
const fs = require('fs')
const swal = require('sweetalert')
const waterfall = require('async/waterfall')

const loadConfIntoStore = require('./load-conf-into-dev')
const generateCmd = require('./cmd-gen')
const getPaths = require('./get-doc-paths')

const RPCPORT='8369'
const RPCUSER='u'
const RPCPASSWORD='p'
const RPCALLOWIP='127.0.0.1'

const checkSyscoind = (cb) => {
	exec(generateCmd('cli', `-rpcport=${RPCPORT} -rpcuser=${RPCUSER} -rpcpassword=${RPCPASSWORD} -getinfo`), (err, stdout, stderr) => {
    console.log(err, stdout, stderr)
    if(err) {
			cb(err)
		} else if (stdout){
			cb(false, 'up', stdout)
		} else {
			return cb(null, 'verify', err)
		}
	})
}

const checkAndCreateDocFolder = ({ customCssPath, appDocsPath, confPath, logPath }) => {
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

  if (!fs.existsSync(logPath)) {
    // If cant find fusion.cfg file, regenerate it.
    fs.writeFileSync(
      logPath,
      `${(new Date()).toTimeString()}: Fusion started running.`
    )
  }
}

const startUpRoutine = (cb) => {
  let isFirstTime

  const {
    appDocsPath,
    customCssPath,
    confPath,
    logPath
  } = getPaths()

  updateProgressbar(20)

  // Docs path initialization
  checkAndCreateDocFolder({
    appDocsPath,
    customCssPath,
    confPath,
    logPath
  })

  updateProgressbar(30, 'Loading custom CSS')

  // Apply custom settings
  updateProgressbar(50, 'Loading config')
  loadConfIntoStore(confPath, (e) => {
    cb() // Calls callback after fusion.cfg variables are loaded so loading.js can start processing custom vars.
    if (e) {
      return swal('Error', 'Error while loading fusion.conf', 'error')
        .then(() => app.quit())
        .catch(() => app.quit())
    }
  })

  updateProgressbar(60, 'Connecting to syscoin...')

  waterfall([
    done => {
      let isDone = false
      exec(generateCmd('syscoind', `${isFirstTime ? '-reindex' : ''} -daemon=0 -assetindex=1 -assetindexpagesize=${process.env.TABLE_PAGINATION_LENGTH} -server=1 -rpcallowip=${RPCALLOWIP} -rpcport=${RPCPORT} -rpcuser=${RPCUSER} -rpcpassword=${RPCPASSWORD}`), (err) => {
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
        return swal('Corruption detected', 'Your files do not look quite well, reindexing.', 'warning')
          .then(() => done(null, 'reindex'))
          .catch(() => done(true))
      }

      return done(null, false)
    },
    (reindex, done) => {
      if (reindex) {
        exec(generateCmd('syscoind', `-reindex -daemon=0 -assetindex=1 -assetindexpagesize=${process.env.TABLE_PAGINATION_LENGTH} -server=1 -rpcallowip=${RPCALLOWIP} -rpcport=${RPCPORT} -rpcuser=${RPCUSER} -rpcpassword=${RPCPASSWORD}`))
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

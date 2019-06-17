const { exec } = require('child_process')
const { app } = require('electron').remote
const { ipcRenderer } = require('electron')
const fs = require('fs')
const swal = require('sweetalert')
const waterfall = require('async/waterfall')

const loadConfIntoStore = require('./load-conf-into-dev')
const generateCmd = require('./cmd-gen')
const getPaths = require('./get-doc-paths')
const pushToLogs = require('./push-to-logs')
const getSysPath = require('./syspath')
const OS = require('../utils/detect-os')()

const Storage = require('./storage')
const storageSchema = require('./helpers/storage-schema')

const storage = new Storage({
  configName: 'app-storage',
  defaults: { ...storageSchema }
})

const RPCPORT = '8370'
const RPCUSER = 'u'
const RPCPASSWORD = 'p'
const RPCALLOWIP = '127.0.0.1'

const checkSyscoind = (withParams, cb) => {
  exec(
    generateCmd(
      'cli',
      `${
        withParams
          ? `-rpcport=${RPCPORT} -rpcuser=${RPCUSER} -rpcpassword=${RPCPASSWORD}`
          : ''
      } -getinfo`
    ),
    (err, stdout) => {
      if (err) {
        cb(err)
      } else if (stdout) {
        cb(false, 'up', stdout)
      } else {
        return cb(null, 'verify', err)
      }
    }
  )
}

const checkAndCreateDocFolder = ({
  customCssPath,
  appDocsPath,
  confPath,
  logPath
}) => {
  const docs = require('./helpers/css-custom-template') // eslint-disable-line global-require

  if (!fs.existsSync(appDocsPath)) {
    // If docs path doesnt exist, try to create it.
    try {
      fs.mkdirSync(appDocsPath)

      // Attemps to copy custom files
      fs.writeFileSync(customCssPath, docs.css)
    } catch (e) {
      // Show an alert if an error comes up
      return swal(
        'Error',
        "There was an error while reading App's document folder",
        'error'
      )
    }
  }

  if (!fs.existsSync(customCssPath)) {
    // If cant find custom.css file, regenerate it.
    fs.writeFileSync(customCssPath, docs.css)
  }

  if (!fs.existsSync(confPath)) {
    // If cant find fusion.cfg file, regenerate it.
    fs.writeFileSync(confPath, docs.cfg)
  }

  if (!fs.existsSync(logPath)) {
    // If cant find fusion.cfg file, regenerate it.
    fs.writeFileSync(logPath, '')
  }

  pushToLogs(`Starting: Fusion started running.`)
}

const getDatadir = () => {
  const dir = storage.get('appDir') || getSysPath()
  const exists = fs.existsSync(dir)

  if (!exists) {
    try {
      fs.mkdirSync(dir)
    } catch(err) {
      return getSysPath()
    }
  }

  return dir
}

const startUpRoutine = async cb => {
  let isFirstTime

  const { appDocsPath, customCssPath, confPath, logPath } = getPaths()
  const datadir = getDatadir()

  pushToLogs(`Using datadir: ${datadir}`)
  updateProgressbar(20, 'start up routine')

  // Docs path initialization
  await checkAndCreateDocFolder({
    appDocsPath,
    customCssPath,
    confPath,
    logPath
  })

  updateProgressbar(30, 'Loading custom CSS')

  // Apply custom settings
  updateProgressbar(50, 'Loading config')
  await loadConfIntoStore(confPath, e => {
    cb() // Calls callback after fusion.cfg variables are loaded so loading.js can start processing custom vars.
    if (e) {
      return swal('Error', 'Error while loading fusion.conf', 'error')
        .then(() => app.quit())
        .catch(() => app.quit())
    }
  })

  updateProgressbar(60, 'Connecting to syscoin...')

  await waterfall(
    [
      done => {
        let isDone = false
        exec(
          generateCmd(
            'syscoind',
            `${isFirstTime ? '-reindex' : ''} -debug=1 -daemon=${
              OS === 'osx' ? 1 : 0
            } -assetindex=1 -assetindexpagesize=${
              process.env.TABLE_PAGINATION_LENGTH
            } -server=1 -rpcallowip=${RPCALLOWIP} -rpcport=${RPCPORT} -rpcuser=${RPCUSER} -rpcpassword=${RPCPASSWORD} --datadir="${datadir}" -zmqpubwalletrawtx=${process.env.ZMQ_LISTEN}`
          ),
          err => {
            pushToLogs(`Starting syscoind: ${err ? err.message : 'loading...'}`)
            if (!err) {
              return done(null, false)
            }

            isDone = true
            if (err.message.indexOf('-reindex') !== -1) {
              return done(null, true)
            }

            if (err.message.indexOf('already running.') !== -1) {
              return swal(
                'Error',
                'Another instance of Fusion or Syscoin is already running. Fusion will close.',
                'error'
              ).then(() => app.quit())
            }

            return done(null, false)
          }
        )
        setTimeout(() => {
          pushToLogs(`Starting syscoind: waiting to be done`)
          if (!isDone) {
            isDone = true
            done(null, null)
          }
        }, 10000)
      },
      (reindex, done) => {
        if (reindex) {
          pushToLogs(`Starting syscoind: File corruption detected`)
          return swal(
            'Corruption detected',
            'Your files do not look quite well, reindexing.',
            'warning'
          )
            .then(() => done(null, 'reindex'))
            .catch(() => done(true))
        }

        return done(null, false)
      },
      (reindex, done) => {
        if (reindex) {
          pushToLogs(`Starting syscoind: reindexing`)
          exec(
            generateCmd(
              'syscoind',
              `-reindex -daemon=1 -assetindex=1 -assetindexpagesize=${
                process.env.TABLE_PAGINATION_LENGTH
              } -server=1 -rpcallowip=${RPCALLOWIP} -rpcport=${RPCPORT} -rpcuser=${RPCUSER} -rpcpassword=${RPCPASSWORD} --datadir="${datadir}"`
            )
          )
        }
        done()
      },
      done => {
        global.checkInterval = setInterval(() => {
          // Sets a checking interval that will keep pinging syscoind via syscoin-cli to check if its ready.
          checkSyscoind(true, (error, status) => {
            if (error) {
              clearInterval(global.checkInterval)
              updateProgressbar(60, 'Something went wrong.')
              return done(error)
            }

            pushToLogs(`Starting syscoind: ${status}`)

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
    ],
    err => {
      if (err) {
        pushToLogs(`Starting ERROR: ${err}`)

        return swal(
          'Error',
          'Something went wrong during wallet initialization. Exiting.',
          'error'
        ).then(() => app.quit())
      }
    }
  )
}

function updateProgressbar(value, text) {
  pushToLogs(`Starting: ${value}% -> ${text}`)
  document.querySelectorAll('.progress')[0].style.width = `${value}%`
  if (text) {
    // document.querySelectorAll('.progress')[0].innerHTML = text
  }
}

export default startUpRoutine

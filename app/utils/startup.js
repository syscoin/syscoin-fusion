const { exec } = require('child_process')
const fs = require('fs')
const { join } = require('path')
const swal = require('sweetalert')
const { app } = require('electron').remote

const { changeSyscoinDataDir } = require('../actions/options')
const { confError, successStart, reloadSysConf } = require('../actions/startup')
const generateCmd = require('./cmd-gen')
const getSysPath = require('./syspath')

const checkSyscoind = (dispatch, cb) => {
  // Just a test to check if syscoind is ready
  exec(generateCmd('cli', 'getinfo'), (err, stdout) => {
    if (err) {
      console.log(err.message)
      if (err.message.indexOf('code: -28') !== -1) {
        // Verifying wallet... Let the user know.
        return dispatch(reloadSysConf(err.message))
      }
      dispatch(confError())
      return
    }

    let output

    // Tries to parse the output of getinfo. If it's successful, it means that syscoind is working.
    try {
      output = JSON.parse(stdout)
    } catch (error) {
      dispatch(confError())
      return
    }

    // isUp, getinfo output
    cb(true, output)
  })
}

const checkAndCreateDocFolder = () => {
  // Get Doc's path
  const appDocsPath = join(app.getPath('documents'), 'Fusion')
  const cssTemplate = require('./helpers/css-custom-template')
  const customCssPath = join(appDocsPath, 'custom.css')

  if (!fs.existsSync(appDocsPath)) {
    // If docs path doesnt exist, try to create it.
    try {
      fs.mkdirSync(appDocsPath)

      // Attemps to copy custom files
      fs.writeFileSync(
        join(appDocsPath, 'custom.css'),
        cssTemplate
      )
    } catch (e) {
      // Show an alert if an error comes up
      return swal('Error', 'There was an error while reading App\'s document folder', 'error')
    }
  }

  if (!fs.existsSync(customCssPath)) {
    // If cant find custom.css file, regenerate it.
    fs.writeFileSync(
      join(appDocsPath, 'custom.css'),
      cssTemplate
    )
  }
}

const loadCustomCss = () => {
  const customCssPath = join(app.getPath('documents'), 'Fusion', 'custom.css')

  try {
    const css = fs.readFileSync(customCssPath)

    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;
    document.body.appendChild(style);
  } catch(e) {
    swal('Error', 'Error while loading custom CSS', 'error')
  }
}

const startUpRoutine = (dispatch, env) => {
  if (!fs.existsSync(getSysPath('default'))) {
    // Attemps to create SyscoinCore folder if this doesn't exists already.
    try {
      fs.mkdirSync(getSysPath('default'))
    } catch (err) {
      // Failed to create SyscoinCore folder
      dispatch(confError())
      return
    }
  }
  
  // Sets the datadir in reducer
  dispatch(changeSyscoinDataDir('default'))

  // Docs path initialization
  checkAndCreateDocFolder()
  loadCustomCss()

  // Executes syscoind (just in case it's not running already). It'll fail gracefully if its already running
  exec(generateCmd('syscoind', ''), (err) => {
    if (err.message.indexOf('-reindex') !== -1) {
      swal('Corruption detected', 'Your files does not look quite well, reindexing.', 'warning').then(() => {
        return exec(generateCmd('syscoind', '-reindex'))
      }).catch(() => app.quit())
    }
  })

  if (!global.checkInterval) {
    global.checkInterval = setInterval(() => {
      // Sets a checking interval that will keep pinging syscoind via syscoin-cli to check if its ready.
      checkSyscoind(dispatch, (isUp, info) => {
        if (isUp) {
          // if its up, clear the interval.
          clearInterval(global.checkInterval)
          dispatch(successStart(info))
        }
      })
    }, 5000)
  }
}

export default startUpRoutine

const { exec } = require('child_process')
const fs = require('fs')

const { changeSyscoinDataDir } = require('../actions/options')
const { confError, successStart, reloadSysConf } = require('../actions/startup')
const generateCmd = require('./cmd-gen')
const getSysPath = require('./syspath')

const checkSyscoind = (dispatch, cb) => {
  // Just a test to check if syscoind is ready
  exec(generateCmd('cli', 'getinfo'), (err, stdout) => {
    if (err) {
      console.log(err)
      if (err.message.indexOf('code: -28') !== -1) {
        // Verifying wallet... Let the user know.
        return dispatch(reloadSysConf())
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

  // Executes syscoind (just in case it's not running already). It'll fail gracefully if its already running
  exec(generateCmd('syscoind', ''))

  const checkInterval = setInterval(() => {
    // Sets a checking interval that will keep pinging syscoind via syscoin-cli to check if its ready.
    checkSyscoind(dispatch, (isUp, info) => {
      if (isUp) {
        // if its up, clear the interval.
        clearInterval(checkInterval)
        dispatch(successStart(info))
      }
    })
  }, 5000)
}

export default startUpRoutine

const { exec } = require('child_process')
const fs = require('fs')

const { changeSyscoinDataDir } = require('../actions/options')
const { confError, successStart, reloadSysConf } = require('../actions/startup')
const generateCmd = require('./cmd-gen')
const getSysPath = require('./syspath')

const checkSyscoind = (dispatch, cb) => {
  exec(generateCmd('cli', 'getinfo'), (err, stdout) => {
    if (err) {
      console.log(err)
      if (err.message.indexOf('code: -28') !== -1) {
        return dispatch(reloadSysConf())
      }
      dispatch(confError())
      return
    }

    let output

    try {
      output = JSON.parse(stdout)
    } catch (error) {
      dispatch(confError())
      return
    }

    cb(true, output)
  })
}

const startUpRoutine = (dispatch, env) => {
  if (env === 'local') {
    if (!fs.existsSync(getSysPath(env))) {
      try {
        fs.mkdirSync(getSysPath(env))
      } catch (err) {
        dispatch(confError())
        return
      }
    }
  } else {
    dispatch(changeSyscoinDataDir('default'))
  }

  exec(generateCmd('syscoind', ''))

  const checkInterval = setInterval(() => {
    checkSyscoind(dispatch, (isUp, info) => {
      if (isUp) {
        clearInterval(checkInterval)
        dispatch(successStart(info))
      }
    })
  }, 5000)
}

export default startUpRoutine

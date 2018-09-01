const { exec } = require('child_process')
const { app } = require('electron').remote
const fs = require('fs')
const { join } = require('path')
const swal = require('sweetalert')

const generateCmd = require('./cmd-gen')
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

const loadCustomCss = customCssPath => {
  try {
    const css = fs.readFileSync(customCssPath)

    const style = document.createElement("style")
    style.type = "text/css"
    style.innerHTML = css
    document.body.appendChild(style)
  } catch(e) {
    swal('Error', 'Error while loading custom CSS', 'error')
  }
}

const loadConfIntoEnv = confPath => {
  let conf

  try {
    conf = fs.readFileSync(confPath, 'utf-8')
  } catch (e) {
    swal('Error', 'Error while loading fusion.conf', 'error')
    return
  }

  conf.split('\r\n').forEach(i => {
    // Parses fusion.cfg
    const trimmed = i.trim()

    if (trimmed[0] === '#' || !trimmed) {
      // Ignore comments and empty lines
      return
    }

    // Parses keys and values
    const key = trimmed.split('=')[0]
    const value = trimmed.split('=')[1].split(',')

    // Write the key/value pair into environment variables
    global.appStorage.set(key, value === 'none' ? [] : value)
  })
}

const startUpRoutine = (cb) => {
  if (!fs.existsSync(getSysPath('default'))) {
    // Attemps to create SyscoinCore folder if this doesn't exists already.
    try {
      fs.mkdirSync(getSysPath('default'))
    } catch (err) {
      // Failed to create SyscoinCore folder
      swal('Error', 'Failed to create SyscoinCore folder.', 'error').then(() => cb(true)).catch(() => cb(true))
      return
    }
  }

  // Get documents path
  const appDocsPath = join(app.getPath('documents'), 'Fusion')
  const customCssPath = join(appDocsPath, 'custom.css')
  const confPath = join(appDocsPath, 'fusion.cfg')

  updateProgressbar(20)

  // Docs path initialization
  checkAndCreateDocFolder({
    appDocsPath,
    customCssPath,
    confPath
  })

  updateProgressbar(30)

  // Apply custom settings
  loadCustomCss(customCssPath)
  updateProgressbar(50)
  loadConfIntoEnv(confPath)

  updateProgressbar(60)

  // Executes syscoind (just in case it's not running already). It'll fail gracefully if its already running
  exec(generateCmd('syscoind', ''), (err) => {
    if (err.message.indexOf('-reindex') !== -1) {
      swal('Corruption detected', 'Your files does not look quite well, reindexing.', 'warning')
        .then(() => exec(generateCmd('syscoind', '-reindex')))
        .catch(() => app.quit())
    }
  })

  if (!global.checkInterval) {
    global.checkInterval = setInterval(() => {
      // Sets a checking interval that will keep pinging syscoind via syscoin-cli to check if its ready.
      checkSyscoind((error, status, output) => {
        if (error) {
          return swal('Error', 'Something went wrong. Exiting...', 'error').then(() => app.exit()).catch(() => app.exit())
        }

        if (status === 'verify') {
          return updateProgressbar(80, 'Verifying data...')
        }

        if (status === 'up') {
          updateProgressbar(100)
          // if its up, clear the interval.
          clearInterval(global.checkInterval)
          cb(null, output)
        }
      })
    }, 5000)
  }
}

function updateProgressbar(value) {
  document.querySelectorAll('.progress')[0].style.width = `${value}%`
}

export default startUpRoutine

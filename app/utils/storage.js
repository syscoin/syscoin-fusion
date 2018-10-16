const electron = require('electron')
const path = require('path')
const fs = require('fs')

class Store {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')
    this.path = path.join(userDataPath, `${opts.configName}.json`)
    
    this.data = parseDataFile(this.path, opts.defaults)
  }
  
  get(key) {
    return this.data[key]
  }

  set(key, val) {
    this.data[key] = val
    fs.writeFileSync(this.path, JSON.stringify(this.data))
  }

  eraseAll() {
    this.set('guid', '')
    this.set('main_white', '')
    this.set('full_white', '')
    this.set('main_blue', '')
    this.set('main_background', '')
    this.set('accounts_background', '')
    this.set('asset_guid', '')
    this.set('main_red', '')
    this.set('main_green', '')
    this.set('title_color', '')
    this.set('splashscreen_url', '')
    this.set('progress_bar_color', '')
    this.set('background_logo', '')
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath))
  } catch(error) {
    return defaults
  }
}

module.exports = Store

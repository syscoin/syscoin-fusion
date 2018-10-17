import fs from 'fs'
import each from 'async/each'

export default (confPath: string, cb: Function) => {
  let conf

  global.appStorage.eraseAll()

  try {
    conf = fs.readFileSync(confPath, 'utf-8')
  } catch (e) {
    cb(e)
    throw new Error('Error while loading fusion.conf. Directory exists?')
  }

  each(conf.split(/\n/g), (i, done) => {
    // Parses fusion.cfg
    const trimmed = i.trim()

    if (trimmed[0] === '#' || !trimmed) {
      // Ignore comments and empty lines
      return done()
    }

    // Parses keys and values
    const key = trimmed.split('=')[0]
    let value

    if (key === 'guid') {
      value = trimmed.split('=')[1].split(',')
    } else {
      value = trimmed.split('=')[1] // eslint-disable-line prefer-destructuring
    }

    // Write the key/value pair into environment variables
    global.appStorage.set(key, value === 'none' ? '' : value)

    done()
  }, () => {
    cb()
  })
}

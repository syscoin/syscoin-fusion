import fs from 'fs'
import swal from 'sweetalert'

export default (confPath: string) => {
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
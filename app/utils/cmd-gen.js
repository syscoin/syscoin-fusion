const path = require('path')
const getSysPath = require('./syspath')
const isProd = require('./is-production')
const OS = require('./detect-os')(true)

const extraDir = isProd ? path.join(process.resourcesPath, '..', 'extra') : path.join(process.cwd(), 'extra')
const syscoinBinPath = path.join(extraDir, OS)
const syscoinCliPath = path.join(syscoinBinPath, OS === 'windows' ? 'syscoin-cli.exe' : 'syscoin-cli')
const syscoindPath = path.join(syscoinBinPath, OS === 'windows' ? 'syscoind.exe' : 'syscoind')

const generateCmd = (type: string, cmdLine: string = ''): string => {
  const syscoinDataPath = getSysPath()
  let cmd = ''

  if (OS === 'windows') {
    switch (type) {
      case 'syscoind':
        cmd += `"${syscoindPath}" --datadir="${syscoinDataPath}" `
        break
      case 'cli':
        cmd += `"${syscoinCliPath}" --datadir="${syscoinDataPath}" `
        break
      default:
        return null
    }
  } else {
    switch (type) {
      case 'syscoind':
        cmd += `${syscoindPath} --datadir="${syscoinDataPath}" `
        break
      case 'cli':
        cmd += `${syscoinCliPath} --datadir="${syscoinDataPath}" `
        break
      default:
        return null
    }
  }

  if (cmdLine.length) {
    cmd += cmdLine
  }

  return cmd
}

export default generateCmd

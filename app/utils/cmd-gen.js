const path = require('path')
const getSysPath = require('./syspath')
const isProd = require('./get-env')() === 'production' // eslint-disable-line global-require
const OS = require('./detect-os')(true)

const extraDir = isProd ? path.join(process.resourcesPath, '..', 'extra') : path.join(process.cwd(), 'extra')
const syscoinBinPath = path.join(extraDir, OS)
const syscoinCliPath = path.join(syscoinBinPath, OS === 'windows' ? 'syscoin-cli.exe' : 'syscoin-cli')
const syscoindPath = path.join(syscoinBinPath, OS === 'windows' ? 'syscoind.exe' : 'syscoind')

const generateCmd = (type: string, cmdLine: string = ''): string => {
  const syscoinDataPath = getSysPath()
  let cmd = ''

  switch (type) {
    case 'syscoind':
      // cmd += `"${syscoindPath}" --datadir="${syscoinDataPath}" `
      cmd += `${syscoindPath}`
      break
    case 'cli':
      cmd += `${syscoinCliPath} `
      break
    default:
      throw new Error('type should be either "cli" or "syscoind"')
  }

  if (cmdLine.length) {
    cmd += cmdLine
  }
  return cmd
}

export default generateCmd

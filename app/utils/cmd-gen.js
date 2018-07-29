const path = require('path')
const isProd = require('./is-production')()
const getSysPath = require('./syspath')

const OS = require('./detect-os')(true)

const appDir = process.cwd()
const syscoinBinPath = path.join(appDir, 'sys_dependencies', isProd ? '' : OS)
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

  console.log(cmd)

  return cmd
}

export default generateCmd

const path = require('path')
const getSysPath = require('./syspath')

const appDir = process.cwd()
const syscoinBinPath = path.join(appDir, 'sys_dependencies', 'windows')
const syscoinCliPath = path.join(syscoinBinPath, 'syscoin-cli.exe')
const syscoindPath = path.join(syscoinBinPath, 'syscoind.exe')

const generateCmd = (type: string, cmdLine: string = ''): string => {
  const syscoinDataPath = getSysPath()
  let cmd = ''

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

  if (cmdLine.length) {
    cmd += cmdLine
  }

  console.log(cmd)

  return cmd
}

export default generateCmd

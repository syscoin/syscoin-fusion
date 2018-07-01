const path = require('path');

const appDir = process.cwd();
const syscoinBinPath = path.join(appDir, 'sys_dependencies');
const syscoinCliPath = path.join(syscoinBinPath, 'syscoin-cli.exe');
const syscoindPath = path.join(syscoinBinPath, 'syscoind.exe');
const syscoinDataPath = path.join(syscoinBinPath, 'syscore');

const generateCmd = (type: string, cmdLine: string = ''): string => {
  let cmd = '';

  switch (type) {
    case 'syscoind':
      cmd += `"${syscoindPath}" --datadir="${syscoinDataPath}" `;
      break;
    case 'cli':
      cmd += `"${syscoinCliPath}" --datadir="${syscoinDataPath}" `;
      break;
    default:
      return null;
  }

  if (cmdLine.length) {
    cmd += cmdLine;
  }

  return cmd;
};

export default generateCmd;

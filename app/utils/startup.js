const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const appDir = process.cwd();

// const store = require('../store/configureStore').configureStore()

const { confError, successStart } = require('../actions/startup');
const generateCmd = require('./cmd-gen');

const syscoinDataPath = path.join(appDir, 'sys_dependencies', 'syscore');

// const syscoinConfPath = path.join(syscoinDataPath, 'syscoin.conf')

const checkSyscoind = (dispatch, cb) => {
  exec(generateCmd('cli', 'getinfo'), (err, stdout, stderror) => {
    if (err) {
      dispatch(confError());
      return;
    }

    if (stderror) {
      if (stderror.indexOf('Loading wallet') !== -1) {
        return cb(false);
      }

      dispatch(confError());
      return;
    }

    let output;

    try {
      output = JSON.parse(stdout);
    } catch (error) {
      dispatch(confError());
      return;
    }

    cb(true, output);
  });
};

const startUpRoutine = dispatch => {
  if (!fs.existsSync(syscoinDataPath)) {
    try {
      fs.mkdirSync(syscoinDataPath);
    } catch (err) {
      dispatch(confError());
      return;
    }
  }

  exec(generateCmd('syscoind', '--reindex'));

  const checkInterval = setInterval(() => {
    checkSyscoind(dispatch, (isUp, info) => {
      if (isUp) {
        clearInterval(checkInterval);
        dispatch(successStart(info));
      }
    });
  }, 5000);
};

export default startUpRoutine;

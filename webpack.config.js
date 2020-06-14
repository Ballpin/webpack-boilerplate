let path = require('path');
let BUILD_DIR = path.resolve(__dirname, './dist');
let APP_DIR = path.resolve(__dirname, './src');

const configDirs = {
  BUILD_DIR: BUILD_DIR,
  APP_DIR: APP_DIR
}

function buildConfig(env) {
  if (env === 'dev' || env === 'prod') {
    return require('./config/' + env + '.js')(configDirs);
  } else {
    console.log("Wrong webpack build parameter. Possible choices: 'dev' or 'prod'.")
  }
}

module.exports = buildConfig;
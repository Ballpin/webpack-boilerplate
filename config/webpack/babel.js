import path from 'path';
import {rootPath} from './paths';
const BUILD_DIR = path.resolve(rootPath, 'dist');
const APP_DIR = path.join(rootPath, 'src');

const configDirs = {
  BUILD_DIR: BUILD_DIR,
  APP_DIR: APP_DIR
}

function buildConfig(env) {
  if (env === 'dev' || env === 'prod') {
    return import(`./${env}.js`).then(({default: module}) => module(configDirs))
  } else {
    console.log("Wrong webpack build parameter. Possible choices: 'dev' or 'prod'.")
  }
}

module.exports = buildConfig;
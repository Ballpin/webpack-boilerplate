let HtmlWebpackPlugin = require('html-webpack-plugin');

function buildConfig(configDirs) {
  return {
    entry: `${configDirs.APP_DIR}/index.ts`,
    mode: 'development',
    output: {
      path: configDirs.BUILD_DIR,
      libraryTarget: 'umd',
      filename: 'bundle.js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts']
    },
    module: {
      rules :[
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.jsx$/,
          use : {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript'],
              plugins: [
                [
                  "@babel/plugin-transform-runtime",
                  {
                    "absoluteRuntime": false,
                    "corejs": 3,
                    "helpers": true,
                    "regenerator": true,
                    "useESModules": true,
                    "version": "^7.10.2"
                  }
                ]
              ]
            }
          }
        }
      ]
    },
    devServer: {
      historyApiFallback: true
    },
    plugins: [
      new HtmlWebpackPlugin()
    ]
  };
}

module.exports = buildConfig;
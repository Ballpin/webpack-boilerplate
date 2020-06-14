import {rootPath} from './paths';
import HtmlWebpackPlugin from 'html-webpack-plugin';

function buildConfig(configDirs) {
  return {
    context: rootPath,
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
        // {
        //   test: /\.pcss$/,
        //   use: [
        //     'to-string-loader',
        //     // 'style-loader',
        //     { loader: 'css-loader', options: { importLoaders: 1 } },
        //     { loader: 'postcss-loader', options: {
        //         ident: 'postcss',
        //         plugins: () => [
        //           postcssImport({
        //             root: rootPath,
        //             path: ['node_modules/tailwindcss', 'src/lit-element'],
        //           }),
        //           tailwindcss('./tailwindcss/tailwind.config.js'),
        //           postcssPresetEnv({
        //             stage: 0,
        //             browsers: 'last 2 versions'
        //           }),
        //         ]
        //       }
        //     },
        //   ]
        // },
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
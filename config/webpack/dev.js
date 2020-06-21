import {rootPath} from './paths';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import tailwindcss from 'tailwindcss';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import {recursiveIssuer} from './utils';

function buildConfig(configDirs) {
  return {
    context: rootPath,
    entry: {
      tailwind: [`${configDirs.APP_DIR}/styles/tailwind.pcss`],
      main: [`${configDirs.APP_DIR}/index.ts`],
    },
    mode: 'development',
    optimization: {
      splitChunks: {
        cacheGroups: {
          tailwindStyles: {
            name: 'tailwind',
            test: (m, c, entry = 'tailwind') =>
              m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    output: {
      path: configDirs.BUILD_DIR,
      libraryTarget: 'umd',
      filename: '[name].bundle.js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.pcss']
    },
    module: {
      rules :[
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.pcss$/,
          use: [
            'to-string-loader',
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            { loader: 'postcss-loader', options: {
                ident: 'postcss',
                plugins: () => [
                  postcssImport({
                    root: rootPath,
                    path: ['node_modules/tailwindcss', 'src/styles'],
                  }),
                  tailwindcss('./config/tailwind/tailwind.config.js'),
                  postcssPresetEnv({
                    stage: 0,
                    browsers: 'last 2 versions'
                  }),
                ]
              }
            },
          ]
        },
        {
          test: /\.ts$/,
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
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
      ]
    },
    devServer: {
      historyApiFallback: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        scriptLoading: 'defer',
        inject: true
      })
    ]
  };
}

module.exports = buildConfig;
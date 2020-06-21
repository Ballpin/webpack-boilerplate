import HtmlWebpackPlugin from 'html-webpack-plugin';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import postcssPresetEnv from 'postcss-preset-env';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import {rootPath} from './paths';
import {recursiveIssuer} from './utils';

function buildConfig(configDirs) {
  return {
    context: rootPath,
    entry: {
      tailwind: [`${configDirs.APP_DIR}/styles/tailwind.pcss`],
      main: [`${configDirs.APP_DIR}/index.ts`],
    },
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
    mode: 'development',
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
          use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader' ]
        },
        {
          test: /\.pcss$/,
          use: [
            'to-string-loader',
            MiniCssExtractPlugin.loader,
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
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin(),
    ]
  };
}

module.exports = buildConfig;
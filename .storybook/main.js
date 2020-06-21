const path = require('path');
const tailwindcss = require('tailwindcss');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const rootPath = process.cwd();
const BUILD_DIR = path.resolve(rootPath, 'dist');
const APP_DIR = path.join(rootPath, 'src');

module.exports = {
  stories: ['../src/**/*.stories.[tj]s'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Entry
    config.entry.push(`${APP_DIR}/styles/tailwind.pcss`);

    // Extensions
    config.resolve.extensions.push('.pcss');

    // Make whatever fine-grained changes you need
    config.module.rules.push({
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
    },);

    // Return the altered config
    return config;
  },
};
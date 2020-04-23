/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { InjectManifest, GenerateSW } = require('workbox-webpack-plugin');
const packageAPP = require('./package.json');

module.exports = env => {
  console.log('Environnement : ', env.NODE_ENV);
  /**
   * Loading the correct configuration file according to env.NODE_ENV (local,docker,...)
   */
  const conf = require(`./configuration/${env.NODE_ENV}/configuration.json`);
  /**
   * PUBLIC_PATH : absolute URL (ex: not ./index.js but http://url.insee.fr/index.js)
   * This configuration is necessary to ensure the proper functioning of the micro-frontend.
   */
  const PUBLIC_PATH = `${conf.urlQueen}/`;
  return {
    // Entry point
    entry: './src/index.js',
    module: {
      rules: [
        /**
         * Rule for js/jsx files
         * (exclude node_modules and use babel-loader, see .babelrc for details)
         */ {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        /**
         * Rule for image
         * Simply use the file-loader
         * copy images to folder static/images
         */
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          use: {
            loader: 'file-loader',
            query: {
              outputPath: 'static/images',
              name: '[name].[ext]',
            },
          },
        },
        /**
         * Rule for scss files
         *  sass-loader : for .scss file (compile scss -> css)
         *  css-loader special : loader for css file
         *  to-string-loader : for writing css into js file
         */
        {
          test: /\.scss$/,
          use: ['to-string-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },

    /**
     * Splitting js files to have multiple js file (minify js files)
     */

    optimization: {
      concatenateModules: false,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          runtime: { enforce: true },
          // Split vendor code to its own chunk(s)
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },

    output: {
      path: `${__dirname}/build`,
      publicPath: PUBLIC_PATH,
      filename: `${packageAPP.name}.${packageAPP.version}.[hash].js`,
    },

    node: {
      module: 'empty',
      fs: 'empty',
    },
    plugins: [
      /**
       * Inject generated js/css files into index.html
       */
      new HtmlWebpackPlugin({
        template: 'public/index.html',
      }),

      /**
       * Create asset-manifest.json file with js file generated.
       * This file will be fetched by an app that integrates Queen to then add the Queen scripts.
       */

      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: PUBLIC_PATH,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.map(url => PUBLIC_PATH + url);

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),

      /**
       * Copy file from public folder to build folder (ignoring by webpack)
       */
      new CopyPlugin([
        { from: 'public/manifest.json', to: 'manifest.json' },
        { from: 'public/index.css', to: 'index.css' },
        { from: 'public/favicon.ico', to: 'favicon.ico' },
        { from: 'public/static/images/icons/*.png', to: 'static/images/icons/[name].[ext]' },
        { from: `configuration/${env.NODE_ENV}/configuration.json`, to: 'configuration.json' },
      ]),

      /**
       * Create Custom service-worker (same as CRA)
       */
      new GenerateSW({
        clientsClaim: true,
        exclude: [/\.map$/, /asset-manifest\.json$/],
        importWorkboxFrom: 'cdn',
        navigateFallback: `${PUBLIC_PATH}index.html`,
        navigateFallbackBlacklist: [
          // Exclude URLs starting with /_, as they're likely an API call
          new RegExp('^/_'),
          // Exclude any URLs whose last part seems to be a file extension
          // as they're likely a resource and not a SPA route.
          // URLs containing a "?" character won't be blacklisted as they're likely
          // a route with query params (e.g. auth callbacks).
          new RegExp('/[^/?]+\\.[^/]+$'),
        ],
      }),
      new InjectManifest({
        precacheManifestFilename: 'queen-precache-manifest-[manifestHash].js',
        exclude: [/\.map$/, /precache-manifest/, /service-worker\.js$/, /index\.html$/],
        swSrc: './src/utils/serviceWorker/external-sw.js',
        swDest: 'queen-service-worker.js',
      }),

      /**
       * For development only (refresh build when we save a file)
       */
      env.NODE_ENV ? new webpack.HotModuleReplacementPlugin() : null,
    ],
    // 3
    devServer: {
      contentBase: './build',
      headers: {
        /**
         * Enable cors (for micro front-end) during developpement
         */
        'Access-Control-Allow-Origin': '*',
      },
      hot: true,
      historyApiFallback: true,
    },
  };
};

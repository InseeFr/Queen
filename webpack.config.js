const webpack = require('webpack');
const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = env => {
  console.log('Environnement : ', env.NODE_ENV);
  /**
   * Loading the correct conf file according to env.NODE_ENV (local,innovation,dv,qf,pre-prod,prod)
   */
  const conf = require(`./configuration/${env.NODE_ENV}/configuration.json`);
  /**
   * PUBLIC_PATH : absolute URL (ex: not ./index.js but http://url.insee.fr/index.js)
   * This configuration is necessary to ensure the proper functioning of the micro-frontend.
   */
  const PUBLIC_PATH = conf.urlQueen + '/';
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
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Split vendor code to its own chunk(s)
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
          },
        },
      },
    },

    output: {
      path: __dirname + '/build',
      publicPath: PUBLIC_PATH,
      filename: `${package.name}.${package.version}.js`,
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
       * Copy file from public folder to build folder (ignoring by webpack)
       */
      new CopyPlugin([
        { from: 'public/manifest.json', to: 'manifest.json' },
        { from: 'public/index.css', to: 'index.css' },
        { from: 'public/favicon.ico', to: 'favicon.ico' },
        { from: 'public/static/images/icons/*.png', to: 'static/images/icons/[name].[ext]' },
      ]),

      /**
       * Create Custom service-worker from sw.js and workbox
       */
      new InjectManifest({
        swSrc: './src/sw.js',
        swDest: './service-worker.js',
        include: [/\.html$/, /\.js$/, /\.css$/, /\.woff2$/, /\.jpg$/, /\.png$/],
      }),

      /**
       * Create assets.json file with js file generated. This file will fetch by Pearl to add script from Queen
       */
      new AssetsPlugin({ filename: 'build/assets.json', entrypoints: true }),

      /**
       * For developpement only (refresh build when we save a file)
       */
      new webpack.HotModuleReplacementPlugin(),
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

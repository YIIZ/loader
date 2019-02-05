const path = require('path')
const webpack = require('webpack')

module.exports = (env, { mode, PROD = (mode ==='production') }) => ({
  entry: {
    app: './index.js',
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: `${process.env.PUBLIC || ''}`,
    // chunkhash not working in dev-server
    filename: PROD ? '[name]-[chunkhash:8].js' : '[name].js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'node_modules/lib'),
        path.resolve(__dirname, 'node_modules/pixi-suite'),
        path.resolve(__dirname, 'node_modules/whatwg-fetch'),
        path.resolve(__dirname, 'node_modules/bootstrap'),
        path.resolve(__dirname, 'node_modules/@teambun/loader'),
      ],
      use: {
        loader: 'babel-loader',
        options: {
          // ignore babelrc in node_modules
          babelrc: false,
          presets: [ ['@babel/preset-env', { modules: false }] ],
          plugins: [
            ['@babel/plugin-transform-runtime', { corejs: 2, useESModules: true }],
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-class-properties',
            ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: false }],
            '@babel/plugin-proposal-do-expressions',
            '@babel/plugin-proposal-logical-assignment-operators',
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/plugin-proposal-optional-chaining',
            // TODO wait https://github.com/tc39/proposal-partial-application
            ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
            ["@babel/plugin-transform-react-jsx", {
              "pragma": "Node.createChildren",
              "pragmaFrag": "Node.createFrag",
            }],
          ],
        },
      },
    }, {
      test: /\.s?css$/,
      use: [{
        // css extract do not support hot reload
        // NOTE if use style-loader on production
        // disable sourceMap for css-loader to clear local info
        loader: PROD ? MiniCssExtractPlugin.loader : 'style-loader',
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: [
            require('autoprefixer')(),
          ],
        },
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          functions: sassFunctions,
        },
      }],
    }, {
      loader: 'url-loader',
      test: path.resolve(__dirname, 'res'),
      type: 'javascript/auto', // fix json type
      options: {
        limit: 1000,
        name: '[name]-[hash:8].[ext]',
      },
    }, {
      test: /\.(png|jpg|gif|mp4|m4a|mp3|ttf)$/,
      exclude: path.resolve(__dirname, 'res'),
      loader: 'url-loader',
      options: {
        limit: 1000,
        name: '[name]-[hash:8].[ext]',
      },
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:8].css',
    }),
    //new CopyWebpackPlugin([{ from: `${__dirname}/third_party/`, to: `${__dirname}/dist/` }]),
    new HTMLPlugin({
      template: 'index.html.ejs',
      // https://github.com/kangax/html-minifier#options-quick-reference
      minify: {
        removeComments: PROD,
      },
    }),
    // new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin({ openAnalyzer: false }),
    // new (require('webpack-jarvis'))(),
  ],
})

// default disable comments for `webpack -p`
// https://github.com/webpack-contrib/terser-webpack-plugin/blob/master/src/index.js#L46
Object.defineProperty(require('terser-webpack-plugin').prototype, 'options', {
  get() { return this._options },
  set(o) { o.terserOptions.output.comments = false; this._options = o },
})


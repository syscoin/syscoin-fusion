/**
 * Base webpack config used across other specific configs
 */

import path from 'path'
import webpack from 'webpack'
import fs from 'fs'
import Dotenv from 'dotenv-webpack'
import { dependencies as externals } from './app/package.json'
import { dependencies as possibleExternals } from './package.json'
import resolve from './webpack.config.resolve'

// Find all the dependencies without a `main` property and add them as webpack externals
function filterDepWithoutEntryPoints(dep: string): boolean {
  // Return true if we want to add a dependency to externals
  try {
    // If the root of the dependency has an index.js, return true
    if (fs.existsSync(path.join(__dirname, `node_modules/${dep}/index.js`))) {
      return false
    }
    const pgkString = fs
      .readFileSync(path.join(__dirname, `node_modules/${dep}/package.json`))
      .toString()
    const pkg = JSON.parse(pgkString)
    const fields = ['main', 'module', 'jsnext:main', 'browser']
    return !fields.some(field => field in pkg)
  } catch (e) {
    console.log(e)
    return true
  }
}

export default {
  externals: [
    ...Object.keys(externals || {}),
    ...Object.keys(possibleExternals || {}).filter(filterDepWithoutEntryPoints)
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },

  output: {
    path: path.join(__dirname, 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    ...resolve.resolve
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.NamedModulesPlugin(),
    new Dotenv({
      path: './.env', // Path to .env file (this is the default)
      safe: true // load .env.example (defaults to "false" which does not use dotenv-safe)
    })
  ]
}

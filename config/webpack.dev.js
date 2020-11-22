const paths = require('./paths')

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

const wdsPort = 3000

module.exports = merge(common, {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map',

  // Spin up a server for quick development
  devServer: {
    contentBase: paths.build,
    hot: true,
    port: wdsPort,
    before: () => {
      try {
        const { networkInterfaces } = require('os')
        const nets = networkInterfaces();
        const results = Object.create(null);

        for (const name of Object.keys(nets)) {
          for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
              if (!results[name]) {
                results[name] = [];
              }

              results[name].push(net.address);
            }
          }
        }

        console.log(`On Your Network: http://${results.en0[0]}:${wdsPort}/`)
      } catch (e) {
        console.error(e)
      }
    }
  },

  plugins: [
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
  ],
})

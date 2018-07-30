// vue.config.js
module.exports = {
  lintOnSave: 'error',
  devServer: {
    proxy: {
      '/api': {
        // target: 'https://us-central1-sensorhub-190611.cloudfunctions.net/api',
        target: 'http://localhost:5000/sensorhub-190611/europe/api',
        changeOrigin: true
      },
      '/catalogManagement/v2': {
        target: 'http://localhost:9999/',
        changeOrigin: true
      },
      '/partyManagement/v2': {
        target: 'http://localhost:8085/',
        changeOrigin: true
      }
    }
  }
}

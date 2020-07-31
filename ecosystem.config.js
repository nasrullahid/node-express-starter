module.exports = {
  apps: [{
    name: 'rest-api',
    script: './app/server.js',
    whatch: true,
    env: {
      NODE_ENV: 'production'
    }
  }]
}

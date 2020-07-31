module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      decimalNumbers: true
    },
    timezone: '+08:00'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      decimalNumbers: true
    },
    timezone: '+08:00'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      decimalNumbers: true
    },
    timezone: '+08:00'
  }
}

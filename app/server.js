require('dotenv').config()
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const db = require('./models')
const logger = require('morgan')
const cors = require('cors')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '../static')))

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Set app config
const title = process.env.TITLE
const port = process.env.PORT
const url = process.env.URL

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token, X-Socket-Id')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

require('./routes')(app)

db.sequelize.sync({ force: false }).then(() => {
  createRoles()
  app.listen(port, () => console.log(title + ' run on ' + url + ' port:' + port))
})

function createRoles () {
  db.Role.findOrCreate({
    where: {
      id: 1,
      name: 'ADMIN'
    }
  })

  db.Role.findOrCreate({
    where: {
      id: 2,
      name: 'USER'
    }
  })
}

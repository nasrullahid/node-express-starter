const jwt = require('jsonwebtoken')
const config = require('../config/configRoles.js')
const Models = require('../models')

module.exports = {
  signToken(req, res) {
    var token = 'Bearer ' + jwt.sign({ id: req.user._id }, config.secret, { expiresIn: 3600 }) // 1h expired
    if (token) {
      res.header('Authorization', token)
      return res.status(200).send({
        code: 200,
        status: 'success',
        message: 'Logged in successfully'
      })
    } else {
      return res.status(400).send({
        code: 400,
        status: 'error',
        message: 'Unauthorization'
      })
    }
  },

  verifyToken(req, res, next) {
    const tokenHeader = req.headers.authorization || req.headers.Authorization
    // console.log('tokenHeader', tokenHeader)
    if (!tokenHeader) {
      return res.status(400).send({
        code: 400,
        status: 'error',
        message: 'Not authorized'
      })
    }
    if (tokenHeader.split(' ')[0] !== 'Bearer') {
      return res.status(400).send({
        code: 400,
        status: 'error',
        message: 'Incorrect token format'
      })
    }

    const token = tokenHeader.split(' ')[1]

    if (!token) {
      return res.status(400).send({
        code: 400,
        message: 'Error',
        errors: 'No token provided'
      })
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          code: 500,
          status: 'error',
          message: err
        })
      }
      req.userId = decoded.id
      var newToken = 'Bearer ' + jwt.sign({ id: decoded.id }, config.secret, { expiresIn: 3600 })// 1h expired
      // console.log('newToken', newToken)
      res.header('authorization', newToken)
      next()
    })
  },

  async isAdmin(req, res, next) {
    await Models.User.findByPk(req.userId)
      .then(user => {
        user.getRoles().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            // console.log(roles[i].name)
            if (roles[i].name.toUpperCase() === 'ADMIN') {
              next()
              return
            }
          }
          return res.status(400).send({
            code: 400,
            status: 'error',
            message: 'Require Admin Role'
          })
        })
      })
  },

  async isUser(req, res, next) {
    await Models.User.findByPk(req.userId)
      .then(user => {
        user.getRoles().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name.toUpperCase() === 'USER') {
              next()
              return
            }
          }
          return res.status(400).send({
            code: 400,
            status: 'error',
            message: 'Require User Role'
          })
        })
      })
  }

}

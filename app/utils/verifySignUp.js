const Models = require('../models')
const config = require('../config/configRoles')
const ROLEs = config.ROLEs

module.exports = {
  async checkDuplicateUserNameOrEmail(req, res, next) {
    await Models.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        return (400).send({
          code: 400,
          status: 'error',
          message: 'Email is already taken!'
        })
      }

      await Models.User.findOne({
        where: {
          phone: req.body.phone
        }
      }).then(user => {
        if (user) {
          return res.status(400).send({
            code: 400,
            status: 'error',
            message: 'Phone number is already taken!'
          })
        }
        next()
      })
    })
  },

  checkRolesExisted(req, res, next) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLEs.includes(req.body.roles[i].toUpperCase())) {
        return res.status(400).send({
          code: 400,
          status: 'error',
          message: 'Does NOT exist Role = ' + req.body.roles[i]
        })
      }
    }
    next()
  }
}

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('sequelize')
const config = require('../config/configRoles')
const Models = require('../models')

module.exports = {
  async signup (req, res) {
    await Models.User
      .create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        phone: req.body.phone,
        status: 'Active',
        photo: 'avatar.png'
      }).then(user => {
        return Models.Role.findAll({
          where: {
            name: {
              [db.Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          return user.setRoles(roles).then(async () => {
            return res.status(200).send({
              code: 200,
              status: 'success',
              data: {
                id: user.id,
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                phone: user.phone,
                photo: user.photo,
                roles: roles.map(item => {
                  return item.name
                })
              },
              message: 'User registered successfully'
            })
          })
        }).catch(err => {
          return res.status(500).send({
            code: 500,
            status: 'error',
            message: err
          })
        })
      }).catch(err => {
        return res.status(500).send({
          code: 500,
          status: 'error',
          message: err
        })
      })
  },

  async signin (req, res) {
    await Models.User
      .findOne({
        where: {
          email: req.body.email,
          status: 'Active'
        },
        include: [
          {
            model: Models.Role,
            attributes: ['name'],
            through: { attributes: [] }
          }
        ]
      }).then(user => {
        if (!user) {
          return res.status(400).send({
            code: 400,
            status: 'error',
            message: 'User not found or has ben suspended'
          })
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
        if (!passwordIsValid) {
          return res.status(400).send({
            code: 400,
            status: 'error',
            message: 'Invalid Password'
          })
        }

        var token = 'Bearer ' + jwt.sign({ id: user.id }, config.secret, { expiresIn: 3600 }) // 1h expired
        res.header('Authorization', token)
        return res.status(200).send({
          code: 200,
          status: 'success',
          data: {
            id: user.id,
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            address: user.alamat,
            phone: user.phone,
            photo: user.photo,
            about: user.about,
            jobTitle: user.jobTitle,
            roles: user.Roles.map(item => {
              return item.name
            })
          },
          message: 'Logged in successfully'
        })
      }).catch(err => {
        return res.status(500).send({
          code: 500,
          status: 'error',
          message: err
        })
      })
  }

}

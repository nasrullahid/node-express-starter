const bcrypt = require('bcryptjs')
const db = require('sequelize')
const Models = require('../models')

module.exports = {
  // Dashboard
  async getDashboard(req, res) {
    return res.status(200).send({
      code: 200,
      status: 'success',
      message: 'Get Dashboard'
    })
  },

  // User
  async listUser(req, res) {
    const search = req.query.search || ''
    const role = req.query.role || ''
    const status = req.query.status || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 25
    const options = {
      attributes: ['id', 'uuid', 'photo', 'name', 'email', 'phone', 'status', 'createdAt'],
      page: page,
      paginate: limit,
      include: [
        {
          model: Models.Role,
          attributes: ['name'],
          through: { attributes: [] },
          where: { name: { [db.Op.substring]: role } }
        }
      ],
      where: {
        [db.Op.or]: [
          { name: { [db.Op.substring]: search } },
          { email: { [db.Op.substring]: search } },
          { phone: { [db.Op.substring]: search } }
        ],
        status: { [db.Op.substring]: status }
      },
      order: [['createdAt', 'DESC']]
    }
    const { docs, pages, total } = await Models.User.paginate(options)

    let totalPage = 1
    if (limit > 0) {
      totalPage = Math.round(total / limit)
    }

    const response = {
      code: 200,
      status: 'success',
      data: docs,
      count: total,
      page: page,
      total_page: totalPage,
      message: 'Get All User'
    }
    return res.status(200).send(response)
  },
  async addUser(req, res) {
    const roles = await Models.Role.findAll({
      attributes: ['id', 'name'],
      where: {
        name: { [db.Op.in]: req.body.roles }
      }
    })
    if (!roles) {
      return res.status(400).send({
        code: 400,
        status: 'error',
        message: 'One or more roles not found'
      })
    }

    await Models.User
      .create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        phone: req.body.phone,
        status: req.body.status
      }).then(async result => {
        await result.setRoles(roles)
        return res.status(200).send({
          code: 200,
          status: 'success',
          data: result,
          message: 'Created succesfully'
        })
      }).catch(error => {
        return res.status(500).send({
          code: 500,
          status: 'error',
          message: error
        })
      })
  },
  async detailUser(req, res) {
    await Models.User
      .findOne({
        attributes: ['id', 'uuid', 'name', 'email', 'phone', 'address', 'about', 'jobTitle', 'status', 'photo'],
        include: [
          {
            model: Models.Role,
            attributes: ['name'],
            through: { attributes: [] }
          }
        ],
        where: {
          uuid: req.params.uuid
        }
      })
      .then((result) => {
        if (!result) {
          return res.status(400).send({
            code: 400,
            status: 'error',
            message: `User with uuid ${req.params.uuid} not found`
          })
        }
        const response = {
          code: 200,
          status: 'success',
          data: result,
          message: 'Get detail user'
        }
        return res.status(200).send(response)
      })
      .catch((error) => {
        return res.status(500).send({
          code: 500,
          status: 'error',
          message: error,
        })
      })
  },
  async editUser(req, res) {
    const roles = await Models.Role.findAll({
      attributes: ['id', 'name'],
      where: {
        name: { [db.Op.in]: req.body.roles }
      }
    })
    if (!roles) {
      return res.status(500).send({
        code: 400,
        status: 'error',
        message: 'One or more roles not found'
      })
    }

    await Models.User
      .findOne({
        where: { uuid: req.params.uuid }
      })
      .then(result => {
        if (!result) {
          return res.status(400).send({
            code: 400,
            status: 'error',
            message: `User with uuid ${req.params.uuid} not found`
          })
        }

        let newPassword
        if (req.body.password) {
          newPassword = bcrypt.hashSync(req.body.password, 8)
        }
        return result
          .update({
            name: req.body.name || result.name,
            email: req.body.email || result.email,
            password: newPassword || result.password,
            phone: req.body.phone || result.phone,
            status: req.body.status || result.status
          })
          .then(async result => {
            await result.removeRoles()
            await result.setRoles(roles)
            const response = {
              code: 200,
              status: 'success',
              data: result,
              message: 'Updated succesfully',
            }
            return res.status(200).send(response)
          })
          .catch((error) => {
            return res.status(500).send({
              code: 500,
              status: 'error',
              message: error
            })
          })
      })
      .catch((error) => {
        return res.status(500).send({
          code: 500,
          status: 'error',
          message: error
        })
      })
  }

}

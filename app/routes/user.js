const UserController = require('../controllers').user
const verifyJwtToken = require('../utils').verifyJwtToken

module.exports = function (apps) {
  apps.route('/dashboard')
    .get([verifyJwtToken.verifyToken, verifyJwtToken.isUser], UserController.getDashboard)

  return apps
}

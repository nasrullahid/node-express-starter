const UserController = require('../controllers').user
const verifyJwtToken = require('../utils').verifyJwtToken

module.exports = function (apps) {
  apps.route('/user/dashboard')
    .get([verifyJwtToken.verifyToken, verifyJwtToken.isUser], UserController.getDashboard)

  return apps
}

const AuthController = require('../controllers').auth
const verifySignUp = require('../utils').verifySignUp
const verifyJwtToken = require('../utils').verifyJwtToken

module.exports = function (apps) {
  apps.route('/signup')
    .post([verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], AuthController.signup)
  apps.route('/signin')
    .post(AuthController.signin)

  return apps
}

const AuthController = require('../controllers').auth
const verifySignUp = require('../utils').verifySignUp
const verifyJwtToken = require('../utils').verifyJwtToken

module.exports = function (apps) {
  apps.route('/auth/signup')
    .post([verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], AuthController.signup)
  apps.route('/auth/signin')
    .post(AuthController.signin)

  return apps
}

const AdminController = require('../controllers').admin
const verifyJwtToken = require('../utils').verifyJwtToken

module.exports = function (apps) {
  apps.route('/admin/dashboard')
    .get([verifyJwtToken.verifyToken, verifyJwtToken.isAdmin], AdminController.getDashboard)
  apps.route('/admin/user')
    .get([verifyJwtToken.verifyToken, verifyJwtToken.isAdmin], AdminController.listUser)
    .post([verifyJwtToken.verifyToken, verifyJwtToken.isAdmin], AdminController.addUser)
  apps.route('/admin/user/:uuid')
    .get([verifyJwtToken.verifyToken, verifyJwtToken.isAdmin], AdminController.detailUser)
    .put([verifyJwtToken.verifyToken, verifyJwtToken.isAdmin], AdminController.editUser)

  return apps
}

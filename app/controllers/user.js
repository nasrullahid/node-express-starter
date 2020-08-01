module.exports = {
  async getDashboard(req, res) {
    return res.status(200).send({
      code: 200,
      status: 'success',
      message: 'Get Dashboard'
    })
  }

}

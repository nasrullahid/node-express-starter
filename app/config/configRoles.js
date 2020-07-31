require('dotenv').config()

module.exports = {
  secret: process.env.SECRET,
  ROLEs: ['ADMIN', 'USER']
}

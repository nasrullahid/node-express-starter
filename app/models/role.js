'use strict'
const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: DataTypes.STRING
  }, {})
  Role.associate = function (models) {
    // associations can be defined here
    Role.belongsToMany(models.User, {
      through: 'user_roles',
      foreignKey: 'roleId',
      otherKey: 'userId'
    })
    sequelizePaginate.paginate(Role)
  }
  return Role
}

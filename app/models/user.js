'use strict'
const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      unique: true,
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'avatar.png'
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'Active'
    },
    resetPass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    forgotPass: {
      type: DataTypes.STRING,
      allowNull: true
    },
    forgotAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {})
  User.associate = function (models) {
    // associations can be defined here
    User.belongsToMany(models.Role, {
      through: 'user_roles',
      foreignKey: 'userId',
      otherKey: 'roleId'
    })

    sequelizePaginate.paginate(User)
  }
  return User
}

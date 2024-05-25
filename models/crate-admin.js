'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class crate - admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  crate - admin.init({
    name: DataTypes.STRING,
    contact: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    cnpj: DataTypes.STRING,
    login: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'crate-admin',
  });
  return crate - admin;
};
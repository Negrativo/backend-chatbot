const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); // Caminho para sua instância do Sequelize

class User extends Model {}

// Inicialize o modelo User com a definição dos campos e configurações do modelo
User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    validate: {
      isEmail: true // Isso valida o formato do email
    }
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  // Sequelize adiciona por padrão os campos createdAt e updatedAt
});

module.exports = User;

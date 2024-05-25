import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Caminho para sua instância do Sequelize

class User extends Model {}

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
  },
  birth_date: {
    type: DataTypes.STRING, // Assume que a data de nascimento é apenas a data, sem hora
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
});

export default User;
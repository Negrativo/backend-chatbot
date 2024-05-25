import { Model, DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Caminho para sua instância do Sequelize

class Event extends Model {}

Event.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  cpfUser: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users', // Nome da tabela de usuários
      key: 'cpf'      // Chave na tabela de usuários que cpfUser está referenciando
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codEvento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: 'Event',
  tableName: 'Events', // Certifique-se de que o nome da tabela corresponda ao nome usado na migração
});

export default Event;

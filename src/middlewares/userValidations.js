const { body } = require('express-validator');

const createUserValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório.'),
  body('email').isEmail().withMessage('Formato de e-mail inválido'),
  body('cpf').notEmpty().withMessage('CPF é obrigatório'),
  body('phoneNumber').notEmpty().withMessage('Telefone é obrigatório')
];

const updateUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Formato de e-mail inválido'),
  body('cpf').notEmpty().withMessage('CPF é obrigatório'),
  body('phoneNumber').notEmpty().withMessage('Telefone é obrigatório')
];

const UserIdValidation = [
    param('id').isInt().withMessage('ID do usuário é numero inteiro.')
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  UserIdValidation
};

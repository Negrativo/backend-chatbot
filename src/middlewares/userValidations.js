import { body, param } from 'express-validator';

export const createUserValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório.'),
  body('email').isEmail().withMessage('Formato de e-mail inválido'),
  body('cpf').notEmpty().withMessage('CPF é obrigatório'),
  body('phoneNumber').notEmpty().withMessage('Telefone é obrigatório')
];

export const updateUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Formato de e-mail inválido'),
  body('cpf').notEmpty().withMessage('CPF é obrigatório'),
  body('phoneNumber').notEmpty().withMessage('Telefone é obrigatório')
];

export const UserIdValidation = [
    param('id').isInt().withMessage('ID do usuário é numero inteiro.')
];

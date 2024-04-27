import { createUserValidation, updateUserValidation, UserIdValidation } from './middlewares/userValidations.js';
import { validationResult } from 'express-validator';
import UserController from './controllers/UserController.js';
import { Router } from "express";
const router = Router();

router.post('/usuario/cadastro', createUserValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    UserController.store(req, res);
});

router.post('/usuario/alterarDados/:id', updateUserValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    UserController.update(req, res);
});

router.post('/usuario/deletar/:id', UserIdValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    UserController.destroy(req, res);
});

router.post('/usuario/dadosSelecionado/:id', UserController.findById);
router.get('/usuario/dados', UserController.show);

export default router;

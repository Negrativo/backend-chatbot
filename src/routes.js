const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator');
const UserController = require('./controllers/UserController');
const { createUserValidation, updateUserValidation, UserIdValidation } = require('./middlewares/userValidations');

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

module.exports = router;

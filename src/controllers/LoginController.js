import Admin from '../model/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

class LoginController {
  static async login(req, res) {
    try {
      const { login, password } = req.body;
      
      // Buscar admin pelo login
      const admin = await Admin.findOne({ where: { login } });
      
      if (!admin) {
        // Admin não encontrado
        return res.status(404).json({ message: 'Admin not found' });
      }

      // Verificar se a senha está correta
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        // Senha incorreta
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ adminId: admin.id }, jwtSecret, { expiresIn: '1h' });

      // Login bem-sucedido
      res.status(200).json({
        message: 'Login successful',
        token: token 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }


  // Verificar de futuramente remover esse metodo do servidor
  // e ser possivel somente inserir manualmente os admins/clientes
  static async createAdmin(req, res) {
    try {
      const { name, login, password, contact, cnpj, email } = req.body;

      // Verificar se o administrador já existe
      const adminExistente = await Admin.findOne({ where: { login } });
      if (adminExistente) {
        return res.status(409).json({ message: 'Admin already exists' });
      }

      // Gerar hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Criar novo administrador
      const novoAdmin = await Admin.create({
        name,
        login,
        password: hashedPassword,
        contact,
        cnpj,
        email
      });

      // Retornar sucesso
      res.status(201).json({
        message: `Admin ${novoAdmin.name} created successfully`,
        adminId: novoAdmin.id
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default LoginController;

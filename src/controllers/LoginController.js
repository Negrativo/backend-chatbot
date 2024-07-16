import Admin from "../model/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

class LoginController {
	static async login(req, res) {
		try {
			const { login, password } = req.body;
			console.log(login, password);
			// Buscar admin pelo login
			const admin = await Admin.findOne({ where: { login } });

			if (!admin) {
				// Admin não encontrado
				return res.status(404).json({ message: "Admin not found" });
			}

			// Verificar se a senha está correta
			const isMatch = await bcrypt.compare(password, admin.password);
			if (!isMatch) {
				// Senha incorreta
				return res.status(401).json({ message: "Invalid credentials" });
			}

			const token = jwt.sign({ adminId: admin.id }, jwtSecret, { expiresIn: "1h" });

			const adminData = {
				name: admin.name,
				contact: admin.contact,
				cnpj: admin.cnpj,
				email: admin.email,
			};

			// Login bem-sucedido
			res.status(200).json({
				message: "Login successful",
				token: token,
				adminData,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Server error" });
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
				return res.status(409).json({ message: "Admin already exists" });
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
				email,
			});

			// Retornar sucesso
			res.status(201).json({
				message: `Admin ${novoAdmin.name} created successfully`,
				adminId: novoAdmin.id,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Server error" });
		}
	}

	static async requestPasswordReset(req, res) {
		try {
			const { email } = req.body;

			// Verificar se o administrador existe
			const admin = await Admin.findOne({ where: { email } });
			if (!admin) {
				return res.status(404).json({ message: "Admin not found" });
			}

			// Gerar token de redefinição de senha
			const resetToken = jwt.sign({ adminId: admin.id }, jwtSecret, { expiresIn: "1h" });

			// Configurar o transporte de e-mail
			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			});

			// Enviar e-mail com o token de redefinição de senha
			const mailOptions = {
				from: process.env.EMAIL_USER,
				to: admin.email,
				subject: "Recuperação de senha",
				text: `Você solicitou uma redefinição de senha para acesso ao portal de administração Chatbot. Use o seguinte token para redefinir sua senha: ${resetToken}`,
			};

			await transporter.sendMail(mailOptions);

			res.status(200).json({ message: "Password reset email sent" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Server error" });
		}
	}
	static async resetPassword(req, res) {
		try {
			const { token, newPassword } = req.body;

			// Verificar o token
			let decoded;
			try {
				decoded = jwt.verify(token, jwtSecret);
			} catch (error) {
				return res.status(400).json({ message: "Invalid or expired token" });
			}

			// Buscar admin pelo ID do token decodificado
			const admin = await Admin.findByPk(decoded.adminId);
			if (!admin) {
				return res.status(404).json({ message: "Admin not found" });
			}

			// Gerar hash da nova senha
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

			// Atualizar a senha do administrador
			admin.password = hashedPassword;
			await admin.save();

			res.status(200).json({ message: "Password reset successful" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Server error" });
		}
	}
}

export default LoginController;

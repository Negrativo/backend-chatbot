import dotenv from "dotenv";
import express, { json } from "express";
import pkg from "pg";
import UsuarioRoutes from "./src/routes/usuarioRoutes.js";
import AgendamentoRoutes from "./src/routes/agendamentoRoutes.js";
import LoginRouter from "./src/routes/loginRoutes.js";
import ConversationsRouter from "./src/routes/conversationRoutes.js";
import EventRouter from "./src/routes/EventRoutes.js";
import cors from "cors";

const { Client } = pkg;
dotenv.config();

const client = new Client({
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	database: process.env.PG_DATABASE,
	//Configurar SSL no banco postgres e servidor node quando subir em produção
	ssl: false, // Opcional, dependendo da configuração do seu banco
});

async function connectToDatabase() {
	try {
		await client.connect();
		console.log("Conexão com o PostgreSQL estabelecida!");
	} catch (error) {
		console.error("Erro na conexão:", error);
	}
}

const app = express();
app.use(json());
app.use(cors());

app.use(UsuarioRoutes);
app.use(AgendamentoRoutes);
app.use(LoginRouter);
app.use(ConversationsRouter);
app.use(EventRouter);

connectToDatabase();

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});

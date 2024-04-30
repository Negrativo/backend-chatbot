import dotenv from 'dotenv';
import express, { json } from 'express';
import pkg from 'pg';
import usuarioRoutes from './src/routes/usuarioRoutes.js'; 
import eventsRoutes from './src/routes/eventsRoutes.js'; 

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
    console.log('Conexão com o PostgreSQL estabelecida!');
  } catch (error) {
    console.error('Erro na conexão:', error);
  }
}

const app = express();
app.use(json());

app.use(usuarioRoutes);
app.use(eventsRoutes);

connectToDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

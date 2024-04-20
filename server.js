require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const routes = require('./src/routes'); // Importe suas rotas

const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: false, // Opcional, dependendo da configuração do seu banco
});

//Configurar SSL no banco postgres e servidor node quando subir em produção

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Conexão com o PostgreSQL estabelecida!');
  } catch (error) {
    console.error('Erro na conexão:', error);
  }
}

const app = express();
app.use(express.json());
// Use as rotas definidas no arquivo routes.js
app.use(routes);

// Chama a função para conectar ao iniciar o servidor
connectToDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

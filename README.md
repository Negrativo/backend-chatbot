**Servidor em node para chatbot rasa**

-Com o npm e node instalado execute "npm install" para baixar as bibliotecas utilizadas no servidor

-Para configurar o banco de dados conectado ao servidor, execute o comando "npm run mount_db", esse comando executa as configurações da migration e aplica as tabelas ao BD

-Para iniciar após configurar o ambiente, execute "npm run dev" e inicia o servidor em modo de desevolvimento, no qual atualiza o server a cada alteração salva.

**Scripts:**

"start": Iniciar servidor

"dev": Iniciar servidor em modo desenvolvimento
    
"mount_db": Configurar tabelas do banco de dados
    
"unmount_db": Desfazer ultima configuração/tabela aplicada do banco de dados
    
"unmount_all_db":  Desfazer todas configuração/tabela aplicada do banco de dados

**Adicionais**
- Para criar uma nova migration use 'npx sequelize-cli migration:generate --name NOME'
- Arquivos Migration são gerados inicialmente no formato ".js", altere para ".cjs" antes de executar o mount_db
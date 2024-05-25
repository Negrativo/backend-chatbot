import User  from '../model/User.js'; // Importe o modelo User

class UserController {
    async store(req, res) {
        const { name, email, cpf, phoneNumber, birth_date } = req.body; // Use birth_date como está sendo esperado no modelo e validação
        try {
            const newUser = await User.create({ name, email, cpf, phone_number: phoneNumber, birth_date });
            console.log(`User created: ${newUser.id}`);
            res.status(201).json({ message: 'Usuário cadastrado com sucesso.', user: newUser });
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: "CPF já cadastrado." });
            }
            res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
        }
    }

    

    async update(req, res) {
      const { id } = req.params;
      const { name, email, cpf, phoneNumber, birthDate } = req.body; // Adicione birthDate à lista de campos recebidos
      console.log(`Attempting to update user: ${id}`);
      try {
          const [updatedRows, [updatedUser]] = await User.update(
              { name, email, cpf, phone_number: phoneNumber, birth_date: birthDate }, // Inclua birth_date no objeto passado para o update
              { where: { id }, returning: true }
          );

          if (!updatedRows) {
              console.log(`User not found: ${id}`);
              return res.status(404).json({ message: "Usuário não encontrado." });
          }
          console.log(`User updated: ${id}`);
          res.json({ message: "Usuário atualizado com sucesso.", user: updatedUser });
      } catch (error) {
          console.error("Update error:", error);
          if (error.name === 'SequelizeUniqueConstraintError') {
              return res.status(400).json({ error: "CPF já cadastrado." });
          }
          console.error("Update error:", error);
          res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
      }
}      
      

    async destroy(req, res) {
        const { codEvento } = req.params;
        console.log(`Attempting to delete user: ${codEvento}`);
        try {
            const deletedRows = await User.destroy({
                where: { codEvento }
            });
            if (!deletedRows) {
                console.log(`User not found: ${codEvento}`);
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
            console.log(`User deleted: ${codEvento}`);
            res.json({ message: 'Usuário deletado com sucesso.' });
        } catch (error) {
            console.error("Delete error:", error);
            res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
        }
    }
    
    
    async show(req, res) {
        try {
          const users = await User.findAll();
          res.send({ users });
        } catch (error) {
          res.status(500).send({ error: error.message });
        }
    }
      

    async findByCpf(req, res) {
      const { cpf } = req.params;
      try {
          const user = await User.findOne({ where: { cpf } });
          if (!user) {
              return res.status(404).json({ message: "Usuário não encontrado." });
          }
          res.json({ user });
      } catch (error) {
          console.error("Erro ao encontrar usuário por CPF:", error);
          res.status(500).json({ error: "Houve um problema interno, tente novamente mais tarde." });
      }
    }
}

export default new UserController();

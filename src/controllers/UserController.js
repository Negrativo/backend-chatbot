import User  from '../model/Usuario.js'; // Importe o modelo User

class UserController {
    async store(req, res) {
        const { name, email, cpf, phoneNumber } = req.body;
        try {
            const newUser = await User.create({ name, email, cpf, phone_number: phoneNumber });
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
        const { name, email, cpf, phoneNumber } = req.body;
        console.log(`Attempting to update user: ${id}`);
        try {
          const [updatedRows, [updatedUser]] = await User.update(
            { name, email, cpf, phone_number: phoneNumber }, 
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
    
      

    async findById(req, res) {
        const { id } = req.params;
        try {
          const user = await User.findByPk(id);
          if (!user) {
            return res.status(404).send({ message: "Usuário não encontrado." });
          }
          res.send({ user });
        } catch (error) {
          res.status(500).send({ error: error.message });
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
      
}

export default new UserController();

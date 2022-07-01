const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const bcrypt = require("bcryptjs");

const createUserController = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password || !avatar) {
    return res.status(400).send({
      message: "Envie todos os campos para o cadastro",
    });
  }

  const foundUser = await userService.findByEmailUserService(email);

  if (foundUser) {
    return res.status(400).send({
      message: "Usuário já existe!",
    });
  }

  const user = await userService
    .createUserSevice(req.body)
    .catch((err) => console.log(err.message));

  if (!user) {
    return res.status(400).send({
      message: "Erro ao criar o usuário, tente mais tarde.",
    });
  }

  const token = authService.generateToken(user.id);

  res.status(201).send({
    user: {
      id: user.id,
      name,
      email,
      avatar,
    },
    token,
  });
};

const findAllUserController = async (req, res) => {
  const users = await userService.findAllUserService();

  if (users.length === 0) {
    return res.status(400).send({
      message: "Não há usuários cadastrados",
    });
  }

  res.send(users);
};

const findUserByIdController = async (req, res) => {
  let idParam;
  if (!req.params.id) {
    req.params.id = req.userId;
    idParam = req.params.id;
  } else {
    idParam = req.params.id;
  }
  if (!idParam) {
    return res.status(400).send({
      message: "Envie um id nos parâmetros para procurar o usuário",
    });
  }

  const user = await userService.findByIdUserService(idParam);

  res.send(user);
};

const updateUserController = async (req, res) => {
  try {
    let { name, email, password, avatar } = req.body;
    const { id } = req.params;

    if (!name && !email && !password && !avatar) {
      res.status(400).send({
        message: "Envie pelo menos um campo para atualizar o usuário",
      });
    }

    const user = await userService.findByIdUserService(id);

    if (user._id != req.userId) {
      return res.status(400).send({
        message: "Você não pode atualizar este usuário",
      });
    }

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    await userService.updateUserService(
      id,
      name,
      email,
      password,
      avatar,
    );

    return res.send({ message: "Usuário atualizado com sucesso!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createUserController,
  findAllUserController,
  findUserByIdController,
  updateUserController,
};

const characterService = require("../services/character.service");

const createCharacterController = async (req, res) => {
  try {
    const { name, image, reality, identity } = req.body;

    if (!name || !image || !reality || !identity) {
      res.status(400).send({
        message: "Envie todos os campos para cadastro",
      });
    }

    const newCharacter = await characterService.createCharacterService(
      name,
      image,
      reality,
      identity,
      req.userId
    );

    return res.send({
      message: "Personagem criado com sucesso!",
      character: newCharacter,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findAllCharacterController = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
      limit = 8;
    }

    if (!offset) {
      offset = 0;
    }

    const characters = await characterService.findAllCharacterService(
      offset,
      limit
    );

    const total = await characterService.countCharacters();

    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null;

    if (characters.length === 0) {
      return res.status(400).send({ message: "Não existe nenhum personagem criado." });
    }

    return res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,

      results: characters.map((character) => ({
        id: character._id,
        name: character.name,
        image: character.image,
        reality: character.reality,
        identity: character.identity,
        userName: character.user.name,
        avatar: character.user.avatar,
        userId: character.user.id,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const searchCharacterController = async (req, res) => {
  const { name } = req.query;

  const foundCharacters = await characterService.searchCharacterService(name);

  if (foundCharacters.length === 0) {
    return res
      .status(400)
      .send({ message: "Não existe nenhum personagem com esse nome." });
  }

  return res.send({
    foundCharacters: foundCharacters.map((character) => ({
      id: character._id,
      name: character.name,
      image: character.image,
      reality: character.reality,
      identity: character.identity,
      userName: character.user.name,
      avatar: character.user.avatar,
      userId: character.user.id,
    })),
  });
};

const findCharacterByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const character = await characterService.findCharacterByIdService(id);

    return res.send({
      id: character._id,
      name: character.name,
      image: character.image,
      reality: character.reality,
      identity: character.identity,
      userName: character.user.name,
      avatar: character.user.avatar,
      userId: character.user.id,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findCharacterByUserIdController = async (req, res) => {
  try {
    const id = req.userId;

    const characters = await characterService.findCharacterByUserIdService(id);

    return res.send({
      characterByUser: characters.map((character) => ({
        id: character._id,
        name: character.name,
        image: character.image,
        reality: character.reality,
        identity: character.identity,
        userName: character.user.name,
        avatar: character.user.avatar,
        userId: character.user.id,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateCharacterController = async (req, res) => {
  try {
    const { name, image, reality, identity } = req.body;
    const { id } = req.params;

    if (!name || !image || !reality || !identity) {
      res.status(400).send({
        message: "Envie pelo menos um campo para atualizar",
      });
    }

    const character = await characterService.findCharacterByIdService(id);

    if (character.user._id != req.userId) {
      return res.status(400).send({
        message: "You didn't create this post",
      });
    }

    await characterService.updateCharacterService(
      id,
      name,
      image,
      reality,
      identity
    );

    return res.send({ message: "Personagem atualizado com sucesso!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteCharacterController = async (req, res) => {
  try {
    const { id } = req.params;

    const character = await characterService.findCharacterByIdService(id);

    if (character.user._id != req.userId) {
      return res.status(400).send({
        message: "Você não pode apagar um personagem que você não criou!",
      });
    }

    await characterService.deleteCharacterService(id);

    return res.send({ message: "Personagem apagado com sucesso!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createCharacterController,
  findAllCharacterController,
  searchCharacterController,
  findCharacterByIdController,
  findCharacterByUserIdController,
  updateCharacterController,
  deleteCharacterController,
};

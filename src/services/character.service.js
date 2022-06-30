const Character = require("../models/Character");

const createCharacterService = (name, image, reality, identity, userId) =>
  Character.create({ name, image, reality, identity, user: userId });

const findAllCharacterService = (offset, limit) =>
  Character.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

const findCharacterByIdService = (id) =>
  Character.findById(id).populate("user");

const countCharacters = () => Character.countDocuments();

const searchCharacterService = (name) =>
  Character.find({
    name: { $regex: `${name || ""}`, $options: "i" },
  })
    .sort({ _id: -1 })
    .populate("user");

const findCharacterByUserIdService = (id) => {
  return Character.find({
    user: id,
  })
    .sort({ _id: -1 })
    .populate("user");
};

const updateCharacterService = (id, name, image, reality, identity) =>
  Character.findOneAndUpdate(
    {
      _id: id,
    },
    {
      name,
      image,
      reality,
      identity,
    },
    {
      rawResult: true,
    }
  );

const deleteCharacterService = (id) => Character.findOneAndDelete({ _id: id });

module.exports = {
  createCharacterService,
  findAllCharacterService,
  findCharacterByIdService,
  countCharacters,
  searchCharacterService,
  findCharacterByUserIdService,
  updateCharacterService,
  deleteCharacterService,
};

const mongoose = require("mongoose");

const CharacterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  reality: {
    type: String,
    required: true,
  },
  identity: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Character = mongoose.model("Character", CharacterSchema);

module.exports = Character;

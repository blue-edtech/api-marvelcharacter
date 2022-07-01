require("dotenv").config();
const jwt = require("jsonwebtoken");
const { findByIdUserService } = require("../services/user.service");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "O token não foi informado!" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res
      .status(401)
      .send({ message: "Token inválido, faça o login novamente!" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ message: "Token mal construido!" });
  }

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res
        .status(401)
        .send({ message: "Token inválido, faça o login novamente!" });
    }

    const user = await findByIdUserService(decoded.id);

    if (!user || !user.id) {
      return res
        .status(401)
        .send({ message: "Token inválido, faça o login novamente!" });
    }

    req.userId = user.id;

    return next();
  });
};

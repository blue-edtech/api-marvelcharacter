const router = require("express").Router();

const characterController = require("../controllers/character.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validId } = require("../middlewares/global.middleware");

router.post(
  "/create",
  authMiddleware,
  characterController.createCharacterController
);
router.get("/", characterController.findAllCharacterController);
router.get("/search", characterController.searchCharacterController);
router.get(
  "/byIdPost/:id",
  validId,
  authMiddleware,
  characterController.findCharacterByIdController
);
router.get(
  "/byUserId",
  authMiddleware,
  validId,
  characterController.findCharacterByUserIdController
);
router.patch(
  "/update/:id",
  validId,
  authMiddleware,
  characterController.updateCharacterController
);
router.delete(
  "/delete/:id",
  validId,
  authMiddleware,
  characterController.deleteCharacterController
);

module.exports = router;

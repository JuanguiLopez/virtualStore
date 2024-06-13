const { Router } = require("express");
const UsersController = require("../controllers/users.controller");
const checkRole = require("../middlewares/checkRole.middleware");
const upload = require("../middlewares/upload.middleware");
const router = Router();

router.get("/", UsersController.getAll);
router.get("/premium/:uid", UsersController.changeRole);
router.post(
  "/:uid/documents",
  upload.array("document"),
  UsersController.uploadDocuments
);
router.post(
  "/:uid/profilePicture",
  upload.single("profile"),
  UsersController.uploadProfilePicture
);
router.post(
  "/:uid/products",
  upload.array("product"),
  UsersController.uploadProducts
);

module.exports = {
  usersRouter: router,
};

const { Router } = require("express");
const UsersController = require("../controllers/users.controller");
const checkRole = require("../middlewares/checkRole.middleware");
const router = Router();

router.get("/premium/:uid", UsersController.changeRole);

module.exports = {
  usersRouter: router,
};

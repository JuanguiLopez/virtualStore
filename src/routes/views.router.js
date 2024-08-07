const { Router } = require("express");
const viewsController = require("../controllers/views.controller");
const validatePrivateAccess = require("../middlewares/validatePrivateAccess.middleware");
const validatePublicAccess = require("../middlewares/validatePublicAccess.middleware");
const checkRole = require("../middlewares/checkRole.middleware");

const router = Router();

/** routes */

router.get("/", validatePrivateAccess, viewsController.getHome);

router.get(
  "/realtimeproducts",
  validatePrivateAccess,
  checkRole(["admin", "premium"]),
  viewsController.getRealTimeItems
);

router.get("/products", validatePrivateAccess, viewsController.getProducts);

router.get("/carts/:cid", validatePrivateAccess, viewsController.getCart);

router.get(
  "/successPurchase",
  validatePrivateAccess,
  viewsController.successPurchase
);

/** chat */
router.get(
  "/chat",
  validatePrivateAccess,
  checkRole("usuario"),
  viewsController.getChat
);

/** register, login y reset password */
router.get("/register", validatePublicAccess, viewsController.getRegister);

router.get("/login", validatePublicAccess, viewsController.getLogin);

router.get(
  "/resetPassword",
  validatePublicAccess,
  viewsController.getResetPassword
);

router.get(
  "/sendEmailResPass",
  validatePublicAccess,
  viewsController.getSendEmailResPass
);

router.get(
  "/usersManager",
  validatePrivateAccess,
  checkRole(["admin"]),
  viewsController.getUsersManager
);

module.exports = router;

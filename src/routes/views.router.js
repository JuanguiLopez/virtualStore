const { Router } = require("express");
const viewsController = require("../controllers/views.controller");

const router = Router();

/** middlewares */
const validatePublicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/");

  next();
};

const validatePrivateAccess = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  next();
};

/** routes */
router.get("/", validatePrivateAccess, viewsController.getHome);

router.get(
  "/realtimeproducts",
  validatePrivateAccess,
  viewsController.getRealTimeItems
);

router.get("/products", validatePrivateAccess, viewsController.getProducts);

router.get("/carts/:cid", validatePrivateAccess, viewsController.getCart);

/** chat */
router.get("/chat", validatePublicAccess, viewsController.getChat);

/** register, login y reset password */
router.get("/register", validatePublicAccess, viewsController.getRegister);

router.get("/login", validatePublicAccess, viewsController.getLogin);

router.get(
  "/resetPassword",
  validatePublicAccess,
  viewsController.getResetPassword
);

module.exports = router;

const { Router } = require("express");
const CartsController = require("../controllers/carts.controller");
const checkRole = require("../middlewares/checkRole.middleware");

const router = Router();

router.get("/:cid", CartsController.getById);

router.post("/", CartsController.create);

router.post(
  "/:cid/product/:pid",
  checkRole("usuario"),
  CartsController.addProduct
);

router.put("/:cid/products/:pid", CartsController.updateProduct);

router.put("/:cid", CartsController.updateProducts);

router.delete("/:cid/products/:pid", CartsController.deleteProduct);

router.delete("/:cid", CartsController.deleteProducts);

router.get("/:cid/purchase", CartsController.purchase);

module.exports = router;

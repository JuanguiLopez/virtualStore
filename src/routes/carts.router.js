const { Router } = require("express");
const CartsController = require("../controllers/carts.controller");

const router = Router();

router.get("/:cid", CartsController.getById);

router.post("/", CartsController.create);

router.post("/:cid/product/:pid", CartsController.addProduct);

router.put("/:cid/products/:pid", CartsController.updateProduct);

router.put("/:cid", CartsController.updateProducts);

router.delete("/:cid/products/:pid", CartsController.deleteProduct);

router.delete("/:cid", CartsController.deleteProducts);

module.exports = router;

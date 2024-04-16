const { Router } = require("express");
const ProductsController = require("../controllers/products.controller");

const router = Router();

router.get("/", ProductsController.getAll);

router.get("/:pid", ProductsController.getById);

router.post("/", ProductsController.create);

router.put("/:pid", ProductsController.update);

router.delete("/:pid", ProductsController.delete);

module.exports = router;

const express = require("express");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//-----------------------
app.listen(8080, () =>
  console.log("El servidor está corriendo el puerto 8080")
);

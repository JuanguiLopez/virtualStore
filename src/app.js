const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const ProductManager = require("./ProductManager");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

const prodManager = new ProductManager(__dirname + "/files/ProductsJG.json");

const port = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config carpeta pública
app.use(express.static(`${__dirname}/public`));

//config uso de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// asigna endpoints a routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//-----------------------
const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} conectado`);

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} desconectado`);
  });

  socket.on("crear producto", async (newProduct) => {
    console.log(newProduct);
    await prodManager.addProduct(newProduct);
    const products = await prodManager.getProducts();

    io.emit("actualizar lista", { products });
  });

  socket.on("eliminar producto", async ({ id }) => {
    await prodManager.deleteProduct(id);
    const products = await prodManager.getProducts();

    io.emit("actualizar lista", { products });
  });
});

const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
//const ProductManager = require("../dao/fileManagers/ProductManager"); // FILE Manager
const ProductManager = require("./dao/dbManagers/ProductManager"); // MongoDB Manager
const messageModel = require("./dao/models/message");
const mongoose = require("mongoose");

const port = 8080;

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

//const prodManager = new ProductManager(__dirname + "/files/ProductsJG.json"); // FILE Manager
const prodManager = new ProductManager(); // MongoDB Manager

mongoose
  .connect(
    `mongodb+srv://juanguilopezh:d9XI13lSGDhdNmth@coderhcluster.xwnfwp2.mongodb.net/ecommerce`
  )
  .then(() => {
    console.log("connected to atlas.");
  });

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
    await prodManager.addProduct(newProduct);
    const products = await prodManager.getProducts(1, 10, "asc", "");
    const productos = products.docs;

    io.emit("actualizar lista", { productos });
  });

  socket.on("eliminar producto", async ({ id }) => {
    await prodManager.deleteProduct(id);
    const products = await prodManager.getProducts(1, 10, "asc", "");
    const productos = products.docs;

    io.emit("actualizar lista", { productos });
  });

  /** CHAT */
  socket.on("new message", async (messageInfo) => {
    await messageModel.create(messageInfo);
    const messages = await messageModel.find().lean();
    io.emit("chat messages", { messages });
  });

  socket.on("authenticated", async ({ myUserName }) => {
    const messages = await messageModel.find().lean();
    socket.emit("chat messages", { messages });

    socket.broadcast.emit("newUser", { newUserName: myUserName });
  });
});

const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

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

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//-----------------------
const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("connected " + socket.id);

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);
  });

  socket.on("message", (message) => {
    console.log(message);
    socket.emit("answer", "Hola, este es un mensaje desde el servidor");
  });
});

const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoStore = require("connect-mongo");
const session = require("express-session");
require("dotenv").config();
const passport = require("passport");
const initializePassport = require("./config/passport.config");
const { port, mongoConnLink, sessionSecret } = require("./config/config");
const { productsService } = require("./repositories");
const { getRouteErrorInfo } = require("./utils/errorHandling/errorInfo");
const errorHandling = require("./middlewares/errorHandling.middleware");
const CustomError = require("./utils/errorHandling/CustomError");
const ErrorTypes = require("./utils/errorHandling/ErrorTypes");
const addLogger = require("./middlewares/addLogger.middleware");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

//const ProductManager = require("../dao/fileManagers/ProductManager"); // FILE Manager
//const ProductManager = require("./dao/dbManagers/ProductManager"); // MongoDB Manager
const messageModel = require("./dao/models/message");
//const ProductsService = require("./services/products.service");

const app = express();

/** Swagger documentation */
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación Virtual Store API",
      description:
        "Api que permite la gestión de una tienda virtual con usuarios, carros y productos, entre otros.",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

/** routers */
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const sessionRouter = require("./routes/sessions.router");
const loggersRouter = require("./routes/loggers.router");
const { usersRouter } = require("./routes/users.router");

//const prodManager = new ProductManager(__dirname + "/files/ProductsJG.json"); // FILE Manager
//const prodManager = new ProductManager(); // MongoDB Manager
//const prodService = new ProductsService();

/** logger middleware */
app.use(addLogger);

/** sessions settings (middleware) */
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: mongoConnLink,
      ttl: 3600,
    }),
  })
);

/** middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config carpeta pública
app.use(express.static(`${__dirname}/public`));

/** passport */
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

/** config uso de handlebars */
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

/** asigna endpoints a routers */
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/loggers", loggersRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);

/** Manejo de errores para rutas no especificadas en la raíz */
app.use((req, res, next) => {
  try {
    throw new CustomError({
      name: "Incorrect route",
      cause: getRouteErrorInfo(),
      message: "The route you are trying to reach does not exist",
      code: ErrorTypes.ROUTING_ERROR,
    });
  } catch (error) {
    next(error);
  }
});

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
    //await prodManager.addProduct(newProduct);
    //await prodService.create(newProduct);
    await productsService.create(newProduct);

    //const products = await prodManager.getProducts(1, 10, "asc", "");
    //const products = await prodService.getAll(1, 10, "asc", "");
    const products = await productsService.getAll(1, 20, "asc", "");
    const productos = products.docs;

    io.emit("actualizar lista", { productos });
  });

  socket.on("eliminar producto", async ({ id }) => {
    //await prodManager.deleteProduct(id);
    //await prodService.delete(id);
    await productsService.delete(id);

    //const products = await prodManager.getProducts(1, 10, "asc", "");
    //const products = await prodService.getAll(1, 10, "asc", "");
    const products = await productsService.getAll(1, 20, "asc", "");
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

app.use(errorHandling);

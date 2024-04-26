const mongoose = require("mongoose");
const { mongoConnLink, persistence } = require("../config/config");

let CartsDao;
let ProductsDao;
let UsersDao;
let TicketsDao;

switch (persistence) {
  case "MONGO":
    /** database connection */
    mongoose.connect(mongoConnLink).then(() => {
      console.log("connected to atlas.");
    });
    CartsDao = require("./dbManagers/CartsManager");
    ProductsDao = require("./dbManagers/ProductManager");
    UsersDao = require("./dbManagers/UsersManager");
    TicketsDao = require("./dbManagers/TicketsManager");
    break;

  case "MEMORY":
    CartsDao = require("./memoryManagers/carts.memory");
    ProductsDao = require("./memoryManagers/products.memory");
    UsersDao = require("./memoryManagers/users.memory");
    TicketsDao = require("./memoryManagers/tickets.memory");
    break;

  case "FS":
    CartsDao = require("./fileManagers/CartsManager");
    ProductsDao = require("./fileManagers/ProductManager");
    break;

  default:
    console.log("Opción de persistencia no existe");
    break;
}

module.exports = {
  CartsDao,
  ProductsDao,
  UsersDao,
  TicketsDao,
};

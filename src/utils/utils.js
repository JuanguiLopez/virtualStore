const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const createHash = (password) => {
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return hashedPassword;
};

const isValidPassword = (user, password) => {
  const isValid = bcrypt.compareSync(password, user.password);
  return isValid;
};

const generateProduct = () => {
  const option = faker.number.int({ min: 1, max: 4 });

  switch (option) {
    case 1:
      category = "Deportes";
      break;

    case 2:
      category = "Tecnología";
      break;

    case 3:
      category = "Suplementos";
      break;

    default:
      category = "Otros";
      break;
  }

  return {
    id: faker.database.mongodbObjectId,
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: `${faker.string.alphanumeric({
      length: 3,
      casing: "upper",
    })}${faker.string.numeric({ length: 3 })}`,
    price: faker.commerce.price(),
    status: faker.datatype.boolean() == true ? "Disponible" : "No disponible",
    stock: faker.number.int({ min: 3, max: 100 }),
    category: category,
    thumbnails: [],
  };
};

module.exports = {
  createHash,
  isValidPassword,
  generateProduct,
};

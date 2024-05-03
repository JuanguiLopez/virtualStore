const getUserErrorInfo = (user) => {
  return `Una o más de las propiedades están incompletas o no son válidas.
    Lista de propiedades requeridas:
        * first_name: se esperaba un string, se recibió ${user.first_name}
        * last_name: se esperaba un string, se recibió ${user.last_name}
        * age: se esperaba un número, se recibió ${user.age}
        * email: se esperaba un string, se recibió ${user.email}
    `;
};

const getProductErrorInfo = (product) => {
  return `Una o más de las propiedades están incompletas o no son válidas.
      Lista de propiedades requeridas:
          * Title: se esperaba un string, se recibió '${product.title}'
          * description: se esperaba un string, se recibió ${product.description}
          * code: se esperaba un string, se recibió '${product.code}'
          * stock: se esperaba un string, se recibió '${product.stock}'
          * price: se esperaba un string, se recibió '${product.price}'
          * category: se esperaba un string, se recibió '${product.category}'
      `;
};

const getRouteErrorInfo = () => {
  return `La ruta a la que está intentando acceder no existe.
  Asegúrese de la ruta que desea visitar e ingrésela de nuevo.`;
};

module.exports = {
  getUserErrorInfo,
  getProductErrorInfo,
  getRouteErrorInfo,
};

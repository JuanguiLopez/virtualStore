const socket = io();

const iptTitulo = document.getElementById("iptTitulo");
const iptDescripcion = document.getElementById("iptDescripcion");
const iptCodigo = document.getElementById("iptCodigo");
const iptStock = document.getElementById("iptStock");
const iptPrecio = document.getElementById("iptPrecio");
const iptCategoria = document.getElementById("iptCategoria");
const fiThumbnails = document.getElementById("fiThumbnails");
const btnAgregar = document.getElementById("btnAgregar");

const realTimeTable = document.getElementById("realTimeTable");
const btnEliminar = document.getElementById("btnEliminar");

//socket.emit("message", "Hello server, sending message from a websocket");

let newProductForm = document.getElementById("newProductForm");
newProductForm.addEventListener("submit", AgregarProducto);

//btnAgregar.addEventListener("click", () => {
function AgregarProducto(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const infoProd = Object.fromEntries(formData.entries());
  //console.log("info form:", infoProd);
  socket.emit("crear producto", infoProd);

  e.target.reset(); // Para limpiar el formulario

  /*socket.emit("crear producto", {
    title: iptTitulo.value,
    description: iptDescripcion.value,
    code: iptCodigo.value,
    price: iptPrecio.value,
    stock: iptStock.value,
    category: iptCategoria.value,
    //thumbnails: fiThumbnails.value,
  });

  iptTitulo.value = "";
  iptDescripcion.value = "";
  iptCodigo.value = "";
  iptPrecio.value = "";
  iptStock.value = "";
  iptCategoria.value = "";
  //fiThumbnails.value = "";
  */
} //);

// Eventos server
socket.on("actualizar lista", ({ products }) => {
  realTimeTable.innerHTML = "";
  products.forEach((prod) => {
    realTimeTable.innerHTML += `
      <tr>
        <td>${prod._id}</td>
        <td>${prod.title}</td>
        <td>${prod.description}</td>
        <td>${prod.price}</td>
        <td>${prod.stock}</td>
        <td>${prod.category}</td>
        <td><button onclick="eliminarProducto('${prod._id}')">Eliminar</button></td>
      </tr>`;
  });
});

function eliminarProducto(id) {
  socket.emit("eliminar producto", { id });
}

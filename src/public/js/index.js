const socket = io();

const realTimeTable = document.getElementById("messages");
const btnAgregar = document.getElementById("btnAgregar");

//socket.emit("message", "Hello server, sending message from a websocket");

btnAgregar.addEventListener("click", () => {
  socket.emit("message", "Hello server, a product was created successfully");
});

socket.on("answer", (message) => {
  realTimeTable.innerHTML += `<br />${message}`;
  //console.log(`message from server: ${message}`);
});

let socket = io();
let myUserName = "";

/** Inputs references */
const userNameTitle = document.getElementById("userNameTitle");
const messageInput = document.getElementById("messageInput");
const messagesLog = document.getElementById("messagesLog");

/** Socket events */

/** Listens */
socket.on("chat messages", ({ messages }) => {
  if (!myUserName) return;
  messagesLog.innerHTML = "";
  messages.forEach((m) => {
    messagesLog.innerHTML += `${m.user}: ${m.message} <br/>`;
  });
});

/** Emits */
messageInput.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    socket.emit("new message", {
      user: myUserName,
      message: e.target.value,
    });

    e.target.value = "";
  }
});

socket.on("newUser", ({ newUserName }) => {
  if (!myUserName) return;

  Swal.fire({
    title: `${newUserName} se ha unido al chat`,
    toast: true,
    position: "top-right",
    timer: 2500,
    showConfirmButton: false,
    icon: "success",
  });
});

/** Sweet Alert (Swal) */
Swal.fire({
  title: "Login",
  text: "Ingresa tu nombre de usuario para continuar",
  input: "email",
  allowOutsideClick: false,
}).then((result) => {
  myUserName = result.value;
  userNameTitle.innerHTML = myUserName;
  console.log("myUserName:", myUserName);
  socket.emit("authenticated", { myUserName });
});

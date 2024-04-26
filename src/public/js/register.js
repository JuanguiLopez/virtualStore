const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("HERE<-------------");
  const data = new FormData(registerForm);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));
  console.log("obj ----->", JSON.stringify(obj));
  fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log("Data", data);
      setTimeout(() => {
        window.location.href = "/login"; // <- redirección desde el front
      }, 2000);
    });
});

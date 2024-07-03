function updateUserRole(id) {
  const newRole = document.getElementById(`select-${id}`).value;

  fetch(`http://localhost:8080/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify({ role: newRole }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status == 200) {
      window.location.reload();
    }
  });
}

function deleteUser(id) {
  fetch(`http://localhost:8080/api/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status == 200) {
      window.location.reload();
    }
  });
}

const addToCart = (cartId, productId) => {
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "POST",
  }).then((res) => {
    if (res.status == 200) {
      window.location.reload();
    }
  });
};

const deleteFromCart = (cartId, productId) => {
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "DELETE",
  }).then((res) => {
    if (res.status == 200) {
      window.location.reload();
    }
  });
};

const purchaseCart = (cartId) => {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: "GET",
  }).then((res) => {
    if (res.status == 200) {
      window.location.href = "/successPurchase";
      //window.location.reload();
    }
  });
};

const goToCart = (cartId) => {
  fetch(`/api/carts/${cartId}`, {
    method: "GET",
  }).then((res) => {
    if (res.status == 200) {
      window.location.href = `/carts/${cartId}`;
      //window.location.reload();
    }
  });
};

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

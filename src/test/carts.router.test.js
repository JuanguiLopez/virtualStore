const chai = require("chai");
const supertest = require("supertest");
const expect = chai.expect;

const request = supertest("http://localhost:8080");

describe("/api/carts tests", () => {
  before(async () => {
    this.cartMock = {
      products: [],
    };

    this.productsMock = {
      products: [
        {
          product: "65da6a4528e1ebcd262eb0f8",
          quantity: 2,
        },
        {
          product: "65dd3cc478a6f59900e2b300",
          quantity: 1,
        },
        {
          product: "65dd3dcd0586e62e1c296408",
          quantity: 3,
        },
      ],
    };

    this.cartId;
  });

  it("Se debe poder crear un carrito correctamente. Validar que se crea el carrito con la propiedad _id ", async () => {
    const response = await request.post(`/api/carts`).send(this.cartMock);
    // console.log("status", response.status);
    // console.log("_body", response._body);
    // console.log("payload", response._body.payload);

    this.cartId = response._body.payload._id;

    expect(response).to.have.property("status");
    expect(response.status).to.be.equal(200);
    expect(response._body.payload).to.have.property("_id");
  });

  it("Se deben actualizar los productos del carrito correctamente.", async () => {
    const response = await request
      .put(`/api/carts/${this.cartId}`)
      .send(this.productsMock);

    // console.log("status", response.status);
    // console.log("_body", response._body);
    // console.log("payload", response._body.payload);

    expect(response).to.have.property("status");
    expect(response.status).to.be.equal(200);
  });

  it("Se debe poder obtener el carrito que fue recientemente actualizado y validar sus productos correctamente.", async () => {
    const response = await request.get(`/api/carts/${this.cartId}`);

    // console.log("status", response.status);
    // console.log("_body", response._body);

    expect(response).to.have.property("status");
    expect(response.status).to.be.equal(200);
    expect(response._body.cart.products.length).to.be.equal(
      this.productsMock.products.length
    );
  });
});

const chai = require("chai");
const supertest = require("supertest");
const expect = chai.expect;

const request = supertest("http://localhost:8080");

describe("/api/products tests", () => {
  before(async () => {
    this.productMock = {
      title: "test product 2",
      description: "Product for test only",
      code: "TST124",
      price: 55,
      stock: 20,
      category: "test",
    };
  });

  it("Al obtener los productos con el método GET, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo", async () => {
    const response = await request.get(`/api/products`);
    //console.log("_body", response._body);

    expect(response).to.have.property("status");
    expect(response._body.pageData).to.have.property("payload");
    expect(response._body.pageData.payload).to.be.a("Array");
  });

  it("Con el endpoint mockingproducts se deben poder crear 100 productos, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo", async () => {
    const response = await request.get(`/api/products/mockingproducts`);
    //console.log("status", response.status);
    //console.log("body", response._body);

    expect(response).to.have.property("status");
    expect(response.status).to.be.equal(200);
    expect(response._body).to.have.property("payload");
    expect(response._body.payload).to.be.a("Array");
    expect(response._body.payload.length).to.be.equal(100);
  });

  // Actualmente falla por el middleware que valida el role
  it("Se debe poder crear un producto con el método POST. La primera posición del array debe tener la propiedad _id", async () => {
    const response = await request.post(`/api/products`).send(this.productMock);
    console.log("DOCS", response._body.payload.docs);
    console.log("DOCS[0]", response._body.payload.docs[0]);

    expect(response).to.have.property("status");
    expect(response.status).to.be.equal(200);
    expect(response._body).to.have.property("payload");
    expect(response._body.payload.docs[0]).to.have.property("_id");
  });
});

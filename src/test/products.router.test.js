const chai = require("chai");
const supertest = require("supertest");
const expect = chai.expect;

const request = supertest("http://localhost:8080");

describe("/api/products tests", () => {
  before(async () => {
    this.productMock = {
      title: "test product 3",
      description: "Product for test only",
      code: "TST125",
      price: 85,
      stock: 40,
      category: "test",
    };

    this.loginUserMock = {
      //email: "jd@email.com",
      email: "juanguilopezh@gmail.com",
      password: "12345",
    };

    const loginResponse = await request
      .post("/api/sessions/login")
      .send(this.loginUserMock);

    const cookieFromHeader = loginResponse.headers["set-cookie"][0];
    const cookieParts = cookieFromHeader.split("=");
    this.userCookie = {
      name: cookieParts[0],
      value: cookieParts[1],
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
    const response = await request
      .post(`/api/products`)
      .set("Cookie", `${this.userCookie.name}=${this.userCookie.value}`)
      .send(this.productMock);
    console.log("DOCS", response._body.payload.docs);

    expect(response).to.have.property("status");
    expect(response.status).to.be.equal(200);
    expect(response._body).to.have.property("payload");
    expect(response._body.payload.docs[0]).to.have.property("_id");
  });
});

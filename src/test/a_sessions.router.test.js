const chai = require("chai");
const supertest = require("supertest");
const expect = chai.expect;
const mongoose = require("mongoose");
const userModel = require("../dao/models/user");
const { mongoConnLinkTest } = require("../config/config");

const request = supertest("http://localhost:8080");

// mongoose.connect(mongoConnLinkTest).then(() => {
//   console.log("connected for tests");
// });

describe("/api/sessions tests", function () {
  this.timeout(5000);
  before(async () => {
    this.userMock = {
      first_name: "john",
      last_name: "doe",
      age: 33,
      email: "jdoe333@email.com",
      password: "1234",
    };

    this.loginUserMock = {
      //email: "jd@email.com",
      email: "juanguilopezh@gmail.com",
      password: "12345",
    };

    this.cookie;

    //await mongoose.connection.collections.users.drop();
  });

  it("Debe poder registrar correctamente un usuario.", async () => {
    const { _body, statusCode, text } = await request
      .post("/api/sessions/register")
      .send(this.userMock);
    console.log("_body", _body);
    console.log("statusCode", statusCode);
    console.log("text", text);
    //console.log("response", response);
    expect(_body).to.exist;
    expect(statusCode).to.be.equal(200);
  });

  it("Debe loguear correctamente un usuario y retornar una cookie.", async () => {
    const { _body, statusCode, headers } = await request
      .post("/api/sessions/login")
      .send(this.loginUserMock);

    // console.log("_body", _body);
    // console.log("statusCode", statusCode);
    // console.log("headers", headers);

    const cookieFromHeader = headers["set-cookie"][0];
    //console.log("cookie", cookieFromHeader);
    const cookieParts = cookieFromHeader.split("=");
    this.cookie = {
      name: cookieParts[0],
      value: cookieParts[1],
    };
    expect(_body).to.exist;
    expect(statusCode).to.be.equal(200);
    expect(this.cookie.name).to.be.equal("connect.sid");
    expect(this.cookie.value).to.exist;
  });

  it("Debe enviar la cookie que contiene los datos del usuario y desestructurar correctamente.", async () => {
    const { _body, statusCode, headers } = await request
      .get("/api/sessions/current")
      .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);
    //console.log("_body", _body, "statusCode", statusCode);
    const userFromCookie = _body.payload;

    expect(_body).to.exist;
    expect(statusCode).to.be.equal(200);
    expect(userFromCookie).to.have.property("name");
    expect(userFromCookie).to.have.property("role");
    expect(userFromCookie.email).to.be.equal(this.loginUserMock.email);
  });
});

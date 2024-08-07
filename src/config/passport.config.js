const passport = require("passport");
const local = require("passport-local");
const github = require("passport-github2");
const { createHash, isValidPassword } = require("../utils/utils");
const userModel = require("../dao/models/user");
const { userAdmin, passAdmin } = require("./config");
const { cartsService, usersService } = require("../repositories");

const localStrategy = local.Strategy;
const githubStrategy = github.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        let user;
        const { first_name, last_name, age, email } = req.body;

        //const user = await userModel.findOne({ email: username });
        user = await usersService.getByProperty("email", username); // username es el email, está así por manejo de passport

        try {
          if (user) {
            req.logger.warning(`user with email ${user.email} already exists.`);
            return done(null, false, { message: "user already exists." });
          }

          const cart = await cartsService.create();
          const hashedPassword = createHash(password);

          const newUser = {
            first_name,
            last_name,
            age,
            email,
            password: hashedPassword,
            role: "usuario",
            cart: cart._id,
            isAdmin: false,
            isUser: true,
            isPremium: false,
          };

          //const result = await userModel.create(newUser);
          const result = await usersService.create(newUser);

          req.logger.info(`usuario ${email} creado correctamente.`);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          req.logger.info(`login attemp - email: ${username}`);

          if (username == userAdmin && password == passAdmin) {
            let userAdmin = {
              first_name: "Admin",
              email: username,
              role: "admin",
              isAdmin: true,
              isUser: false,
              isPremium: false,
            };

            req.logger.info(`admin user logged`);
            return done(null, userAdmin);
          } else {
            //const user = await userModel.findOne({ email: username });
            const user = await usersService.getByProperty("email", username); // username es el email, está así por manejo de passport

            if (!user) {
              return done(null, false, { message: "user does not exist." });
            }

            if (!isValidPassword(user, password)) {
              return done(null, false, { message: "incorrect password" });
            }

            req.logger.info(`user logged in with email and password`);
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new githubStrategy(
      {
        passReqToCallback: true,
        clientID: "Iv1.6f21e9f4a7958fd1",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        clientSecret: "880022b93683fe56bb7f6f0f7ed8e85657adc2e1",
      },
      async (req, _accesToken, _refreshToken, profile, done) => {
        try {
          req.logger.info(
            `login attemp with github - email: ${profile._json.email}`
          );

          //const user = await userModel.findOne({ email: profile._json.email });
          const user = await usersService.getByProperty(
            "email",
            profile._json.email
          );
          const cart = await cartsService.create();

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "Doe",
              age: 99,
              email: profile._json.email,
              role: "usuario",
              cart: cart._id,
              isAdmin: false,
            };

            //const result = await userModel.create(newUser);
            const result = await usersService.create(newUser);

            req.logger.info(`user logged in with Github`);
            return done(null, result);
          } else {
            req.logger.info(`user logged in with Github`);
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await userModel.findById(id);
  done(null, user);
});

module.exports = initializePassport;

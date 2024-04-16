const passport = require("passport");
const local = require("passport-local");
const github = require("passport-github2");
const { createHash, isValidPassword } = require("../utils");
const userModel = require("../dao/models/user");
const { userAdmin, passAdmin } = require("./config");

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
        const { first_name, last_name, age, email } = req.body;

        const user = await userModel.findOne({ email: username });

        try {
          if (user) {
            return done(null, false);
          }

          const hashedPassword = createHash(password);

          const result = await userModel.create({
            first_name,
            last_name,
            age,
            email,
            password: hashedPassword,
            role: "usuario",
          });

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
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (username == userAdmin && password == passAdmin) {
            let userAdmin = {
              first_name: "Admin",
              email: username,
              role: "admin",
            };

            return done(null, userAdmin);
          } else {
            const user = await userModel.findOne({ email: username });

            if (!user) {
              return done(null, false);
            }

            if (!isValidPassword(user, password)) {
              return done(null, false);
            }

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
        clientID: "Iv1.6f21e9f4a7958fd1",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        clientSecret: "880022b93683fe56bb7f6f0f7ed8e85657adc2e1",
      },
      async (_accesToken, _refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "Doe",
              age: 99,
              email: profile._json.email,
              role: "usuario",
            };

            const result = await userModel.create(newUser);

            return done(null, result);
          } else {
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

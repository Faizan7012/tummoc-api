require("dotenv").config();
const express = require("express");
const GoogleRouter = express.Router();
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
const session = require("express-session");
const UserModel = require("../model/user");


GoogleRouter.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

GoogleRouter.use(passport.initialize());
GoogleRouter.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
        clientID: '192025642468-v7pb0s526dmc2229r5n7bmvjrkr5kqa6.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "/google/callback",
        passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, cb) {
      let { name, email } = profile._json;
      const user = await UserModel.findOne({ email });
      if (!user) {
        const newUser = new UserModel({
          name,
          email,
          password: "1234",
        });
        newUser.save();
        let { _id } = await UserModel.findOne({ email });
        const token = jwt.sign({ _id }, 'JWT_SECRET', {
          expiresIn: "12h",
        });
        profile.token = token;
        return cb(null, profile);
      }
      const token = jwt.sign({ _id: user._id }, 'JWT_SECRET', {
        expiresIn: "12h",
      });
      profile.token = token;
      return cb(null, profile);
    }
  )
);

GoogleRouter.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//........when we authenticate where we sends the user...........
GoogleRouter.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  function (req, res) {
    const r = req.user;
    res.send({token : r.token , user : r._json , status : true , message : 'Login successfull'})
  }
);



GoogleRouter.get("/logout", (req, res) => {
  req.logout((err, done) => {
    if (err) {
      return res.send({message : "Something went wrong" , status: false});
    }
      return res.send({message : "Logout Successfully"  , status : true});
  });
});

module.exports = GoogleRouter;




const express = require("express");
const { userRegister, userSignin } = require("../controller/user");
const UserModel = require("../model/user");

const userRoute = express.Router();
userRoute.get("/", async (req, res) => {
  try {
    let alluser = await UserModel.find();
    res.json(alluser);
  } catch (error) {
    res.json(error.message);
  }
});

userRoute.post("/register", userRegister);
userRoute.post("/login", userSignin);
module.exports = { userRoute };
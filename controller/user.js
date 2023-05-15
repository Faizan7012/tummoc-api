require("dotenv").config();
var key = process.env.Key;
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user");

const userRegister = async (req, res) => {
  const { email  } = req.body;
  const isPresent = await UserModel.findOne({ email: email });
  if (isPresent) {
    res.json({ status: false, message: "User already registered!" });
  } else {
    try {
            const newUser = new UserModel({
              ...req.body,
            });
            await newUser.save();
            res.json({
              status: true,
              message: "User successfully registered!",
            });
         
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  }
};

const userSignin = async (req, res) => {
  const { email, password } = req.body;
  try {
      const isExist = await UserModel.findOne({ email , password });
     if (!isExist) {
        res.json({ status: false, message: "Wrong credential please try again !" });
           }

       else {
                var token = jwt.sign(
                  {
                    userId: isExist._id,
                    email: isExist.email
                  },
                  'SECRET_KEY',
                  { expiresIn: "7d" }
                );
                res.json({
                  status: true,
                  message: "Login successful",
                  token: token,
                  user: isExist,
                });
           } 

  } catch (error) {
    res.json({ status: false, message: error.message });
  }
 
};

module.exports = { userRegister, userSignin };
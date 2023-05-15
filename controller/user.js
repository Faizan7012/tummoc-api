require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user");

const userRegister = async (req, res) => {
  const { email  } = req.body;
  const isPresent = await UserModel.find({ email: email });
  if (isPresent.length!==0) {
    res.json({ status: false, message: "User already registered!" });
  } else {
    try {
            const newUser = await  UserModel.create({
              ...req.body,
            });
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
      const isExist = await UserModel.find({ email , password });
     if (isExist.length == 0) {
        res.json({ status: false, message: "Wrong credential please try again !" });
           }

       else {
                var token = jwt.sign(
                  {
                    userId: isExist[0]._id,
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
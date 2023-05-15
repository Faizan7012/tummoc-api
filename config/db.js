const mongoose = require("mongoose");

const connect = async () => {
  return mongoose.connect('mongodb+srv://medshoppe:medshoppe@cluster0.uewvucg.mongodb.net/tummoc?retryWrites=true&w=majority');
};

module.exports = connect;
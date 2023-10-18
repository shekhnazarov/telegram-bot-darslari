const { Schema, model } = require("mongoose");

const Filial = new Schema({
  title: String,
  status: {
    type: Boolean,
    default: true,
  },
  phone: Number,
  username: String,
});

module.exports = model("Filial", Filial);

const { Schema, model } = require("mongoose");

const Filiallar = new Schema({
  title: String,
  status: {
    type: Boolean,
    default: true,
  },
  description: String,
});

module.exports = model("Filiallar", Filiallar);

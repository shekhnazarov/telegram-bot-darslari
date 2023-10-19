const { Schema, model } = require("mongoose");

const Office = new Schema({
  title: String,
  img: String,
  desc: String,
  status: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Office", Office);

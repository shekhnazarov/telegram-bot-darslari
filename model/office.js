const { Schema, model } = require("mongoose");

const Office = new Schema({
  title: String,
  img: String,
  username: String,
  mobile: Number,
  status: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Office", Office);

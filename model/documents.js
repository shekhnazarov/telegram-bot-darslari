const { Schema, model } = require("mongoose");

const Doc = new Schema({
  img_first: String,
  img_second: String,
  img_third: String,
  mobile: Number,
  status: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Doc", Doc);

const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

app.use(express.json());

require("./bot/bot");

const dev = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL, { useNewUrlParser: true })
      .then(() => {
        console.log("Mongodb started");
      })
      .catch((err) => console.log(err));
    app.listen(process.env.PORT, () => {
      console.log("Server ishga tushdi");
    });
  } catch (err) {
    console.log(err);
  }
};
dev();

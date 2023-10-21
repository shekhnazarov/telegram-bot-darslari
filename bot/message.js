const { bot } = require("./bot");
const { start } = require("./helper/start");
const { get_all_definitions } = require("./helper/tariflar");
const User = require("../model/user");
const { get_all_office } = require("./helper/about");
const { add_office, add_office_next } = require("./helper/office");

bot.on("message", async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;
  const user = await User.findOne({ chatId }).lean();

  if (text === "/start") {
    start(msg);
  }

  if (user) {
    if (text) {
      if (text.includes("Tariflar")) {
        get_all_definitions(chatId);
      }
      if (
        text.includes("SULTAN TAXI MA'LUMOT") ||
        user.action === "get_office_location"
      ) {
        get_all_office(chatId);
      }

      if (
        text.includes("Orqaga") &&
        (user.action === "response_definitions" ||
          user.action === "get_office_location")
      ) {
        await User.findByIdAndUpdate(
          user._id,
          { ...user, action: "menu" },
          { new: true }
        );
        start(msg);
        return;
      }

      if (
        text.includes("Asosiy") &&
        (user.action === "response_definitions" ||
          user.action === "get_office_location")
      ) {
        await User.findByIdAndUpdate(
          user._id,
          { ...user, action: "menu" },
          { new: true }
        );
        start(msg);
        return;
      }

      if (text.includes("Offise qo'shish")) {
        add_office(chatId);
      }

      if (user.action === "new_office_title") {
        add_office_next(chatId, text, "title");
      }
      if (user.action === "new_office_username") {
        add_office_next(chatId, text, "username");
      }
    }

    if (user.action === "new_office_img") {
      if (msg.photo) {
        add_office_next(chatId, msg.photo.at(-1).file_id, "img");
      } else {
        bot.sendMessage(
          chatId,
          "Mahsulot rasmini oddiy rasm ko'rinishida yuklang"
        );
      }
    }
    if (user.action === "new_office_mobile") {
      add_office_next(chatId, text, "mobile");
    }
  }
});

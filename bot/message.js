const { bot } = require("./bot");
const { start } = require("./helper/start");
const { get_all_definitions } = require("./helper/tariflar");
const User = require("../model/user");
const { get_all_office } = require("./helper/about");

bot.on("message", async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;
  const user = await User.findOne({ chatId }).lean();

  if (text === "/start") {
    start(msg);
  }

  if (text.includes("Tariflar")) {
    get_all_definitions(chatId);
  }
  if (text.includes("SULTAN TAXI MA'LUMOT")) {
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
  }
});

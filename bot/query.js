const { bot } = require("./bot");
const User = require("../model/users");
const { add_category } = require("./helper/category");

bot.on("callback_query", async (query) => {
  const { data } = query;
  const chatId = query.from.id;
  if (data === "add_category") {
    add_category(chatId);
  }
});

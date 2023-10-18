const { bot } = require("./bot");
const { start, requestContact } = require("./helper/start");
const User = require("../model/users");
const { get_all_users } = require("./helper/allusers");
const {
  get_all_categories,
  new_category,
  save_category,
} = require("./helper/category");

bot.on("message", async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;

  const user = await User.findOne({ chatId }).lean();

  if (text === "/start") {
    start(msg);
  }

  if (user) {
    if (user?.action === "request_contact" && !user.phone) {
      requestContact(msg);
    }

    if (text === "Foydalanuvchilar") {
      get_all_users(msg);
    }

    if (text === "Katalog") {
      get_all_categories(chatId);
    }

    if (user.action === "add_category") {
      new_category(msg);
    }

    if (user.action.includes(`edit_category-`)) {
      let id = user.action.split("-")[1];
      save_category(chatId, text);
    }
  }
});

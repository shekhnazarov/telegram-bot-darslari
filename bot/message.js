const { bot } = require("./bot");
const { start, requestContact } = require("./helper/start");
const User = require("../model/users");
const { get_all_users } = require("./helper/allusers");
const { get_all_categories, new_category } = require("./helper/category");
const {
  get_all_filiallar,
  add_filial,
  new_filial,
} = require("./helper/filial");

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
      get_all_categories(msg);
    }

    if (text === "Filiallar" || user.action === "Filiallar") {
      get_all_filiallar(msg);
    }
    if (text === "Yangi filial qo'shish") {
      add_filial(msg);
    }

    if (user.action === "add_filial") {
      new_filial(msg);
    }

    if (user.action === "add_category") {
      new_category(msg);
    }
  }
});

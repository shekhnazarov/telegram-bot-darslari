const { bot } = require("../bot");
const User = require("../../model/users");
const { adminKeboard, userKeyboard } = require("../menu/keyboard");

const get_all_users = async (msg) => {
  const chatId = msg.from.id;
  let user = await User.findOne({ chatId }).lean();
  if (user.admin) {
    let users = await User.find().lean();
    bot.sendMessage(
      chatId,
      `Foydalanuvchilar ro'yhati:${users?.map(
        (user) => `\n${user?.name}: ${user?.phone}`
      )}`
    );
    console.log(users);
  } else {
    bot.sendMessage(chatId, "Sizga bunday so'rov mumkin emas!", {
      reply_markup: {
        keyboard: userKeyboard,
        resize_keyboard: true,
      },
    });
  }
};

module.exports = {
  get_all_users,
};
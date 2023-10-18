const { bot } = require("../bot");
const User = require("../../model/users");
const { userKeyboard } = require("../menu/keyboard");

const get_all_users = async (msg) => {
  const chatId = msg.from.id;
  let user = await User.findOne({ chatId }).lean();
  if (user.admin) {
    let users = await User.find().lean();
    bot.sendMessage(
      chatId,
      `Foydalanuvchilar ro'yhati:
${users?.map((user) => `${user?.name}: ${user?.phone}`)}`
    );
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

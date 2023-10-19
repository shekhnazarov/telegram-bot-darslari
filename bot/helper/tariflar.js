const { bot } = require("../bot");
const User = require("../../model/user");

const get_all_definitions = async (chatId) => {
  const user = await User.findOne({ chatId }).lean();
  await User.findByIdAndUpdate(
    user._id,
    { ...user, action: "response_definitions" },
    { new: true }
  );
  bot.sendMessage(
    chatId,
    "🚖 Sizga kerakli bo'lgan ta'riflardan birortasini tanlashingiz mumkin",
    {
      reply_markup: {
        keyboard: [
          [
            {
              text: "🚖Start",
            },
            {
              text: "🚖Ekanom",
            },
          ],
          [
            {
              text: "🚖Komfort",
            },
            {
              text: "🚖Biznes",
            },
          ],
          [
            {
              text: "🚖Yetkazish",
            },
            {
              text: "🚖Yuk Tashish",
            },
          ],
          [
            {
              text: "🔙Orqaga",
            },
            {
              text: "🔝Asosiy Menu",
            },
          ],
        ],
        resize_keyboard: true,
      },
    }
  );
};

module.exports = {
  get_all_definitions,
};

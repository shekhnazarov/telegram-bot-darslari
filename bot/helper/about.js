const { bot } = require("../bot");
const User = require("../../model/user");
const Office = require("../../model/office");

const get_all_office = async (chatId) => {
  const user = await User.findOne({ chatId }).lean();
  await User.findByIdAndUpdate(
    user._id,
    { ...user, action: "get_office_location" },
    { new: true }
  );
  const offices = await Office.find().lean();
  const list = offices.reduce((acc, curr, index) => {
    if (index % 2 === 0) {
      acc.push([curr.title]);
    } else {
      acc[acc.length - 1].push(curr.title);
    }
    return acc;
  }, []);
  bot.sendMessage(
    chatId,
    "🚖 Sizga kerakli bo'lgan ofislardan birortasini tanlashingiz mumkin",
    {
      reply_markup: {
        keyboard: [
          ...list,
          [
            {
              text: "🔙Orqaga",
            },
            {
              text: "🔝Asosiy Menu",
            },
          ],
          user.admin
            ? [
                {
                  text: "Offise qo'shish",
                },
              ]
            : [],
        ],
        resize_keyboard: true,
      },
    }
  );
};

module.exports = { get_all_office };

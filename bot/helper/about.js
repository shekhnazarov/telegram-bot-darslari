const { bot } = require("../bot");
const User = require("../../model/user");
const Office = require("../../model/office");
const { clear_draft_office } = require("./office");

const get_all_office = async (chatId) => {
  clear_draft_office();
  const user = await User.findOne({ chatId }).lean();
  await User.findByIdAndUpdate(
    user._id,
    { ...user, action: "get_office_location" },
    { new: true }
  );
  const offices = await Office.find().lean();
  const list = offices.map((office) => {
    return [{ text: office.title }];
  });
  console.log(list);
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

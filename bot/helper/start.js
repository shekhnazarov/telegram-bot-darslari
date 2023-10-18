const { bot } = require("../bot");
const User = require("../../model/users");
const { adminKeyboard, userKeyboard } = require("../menu/keyboard");
const start = async (msg) => {
  const chatId = msg.from.id;

  let checkUser = await User.findOne({ chatId });
  if (!checkUser) {
    let newUser = new User({
      name: msg.from.first_name,
      chatId,
      admin: false,
      status: true,
      createdAt: new Date(),
      action: "request_contact",
    });

    await newUser.save();
    bot.sendMessage(
      chatId,
      `Assalomu aleykum, hurmatli ${msg.from.first_name}. Iltimos telefon raqamizni kiriting`,
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "Tel raqam yuborish",
                request_contact: true,
              },
            ],
          ],
          resize_keyboard: true,
        },
      }
    );
  } else {
    await User.findByIdAndUpdate(
      checkUser._id,
      {
        ...checkUser,
        action: "menu",
      },
      { new: true }
    );
    bot.sendMessage(chatId, "Menyuni tanleng", {
      reply_markup: {
        keyboard: checkUser.admin ? adminKeyboard : userKeyboard,
        resize_keyboard: true,
      },
    });
  }
};

const requestContact = async (msg) => {
  const chatId = msg.from.id;
  if (msg?.contact?.phone_number) {
    let user = await User.findOne({ chatId }).lean();
    user.phone = msg.contact.phone_number;
    user.admin = msg.contact.phone_number == "+998977579151";
    user.action = "menu";
    await User.findByIdAndUpdate(user._id, user, { new: true });
    bot.sendMessage(chatId, "Menyuni tanleng", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Katalog",
            },
          ],
        ],
        resize_keyboard: true,
      },
    });
  }
};

module.exports = {
  start,
  requestContact,
};

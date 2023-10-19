const { bot } = require("../bot");
const User = require("../../model/user");

const start = async (msg) => {
  const chatId = msg.from.id;

  let checkUser = await User.findOne({ chatId });
  if (!checkUser) {
    let newUser = new User({
      name: msg.from.first_name,
      chatId,
      admin: chatId == "907107255" ? true : false,
      status: true,
      createdAt: new Date(),
      action: "menu",
    });

    await newUser.save();
    bot.sendMessage(
      chatId,
      "Assalomu alaykum, ✋\n\n🚖 SULTAN TAXI - YANDEX GO rasmiy hamkorining rasmiy botiga xush kelibsiz!",
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "🚖 Haydovchi bo'lish | Ulanish 🤝",
              },
              {
                text: "🚖 Tariflar",
              },
            ],
            [
              {
                text: "📍 SULTAN TAXI MA'LUMOT",
              },
              {
                text: "📥 Pozivnoydan pul yechish",
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
      { ...chatId, action: "menu" },
      { new: true }
    );
    bot.sendMessage(
      chatId,
      "Assalomu alaykum, ✋\n\n🚖 SULTAN TAXI - YANDEX GO rasmiy hamkorining rasmiy botiga xush kelibsiz!",
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "🚖 Haydovchi bo'lish | Ulanish 🤝",
              },
              {
                text: "🚖 Tariflar",
              },
            ],
            [
              {
                text: "📍 SULTAN TAXI MA'LUMOT",
              },
              {
                text: "📥 Pozivnoydan pul yechish",
              },
            ],
          ],
          resize_keyboard: true,
        },
      }
    );
  }
};

module.exports = {
  start,
};

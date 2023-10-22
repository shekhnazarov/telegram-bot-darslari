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

const get_pay_bot = async (chatId) => {
  bot.sendPhoto(
    chatId,
    "https://avatars.mds.yandex.net/get-altay/5649895/2a0000017eac0810430800025e1174425321/orig",
    {
      caption: `🚖 Sultan taxi - Yandex taxi Rasmiy hamkori\n\n@multidriver_sultantaxibot\n\n💵 Bu bot orqali siz Yandex Pro balansingizni to'ldirganda +25% keshbek va Ynadex Pro balansdagi pullaringizni yechishingiz mumkin bo'ladi !\n\n🚕 Sultan taxi Hammasi tez va oson!`,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📥 Pozivnoydan pul yechish",
              url: "https://t.me/multidriver_sultantaxibot",
            },
          ],
        ],
      },
    }
  );
};

module.exports = {
  start,
  get_pay_bot,
};

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

const definitions = {
  Start: {
    img: "https://www.spot.uz/media/img/2018/06/QncGt115284046749963_l.jpg",
    bepul: 3,
    bkm: 1,
    bosh: 3600,
    kutish: 500,
    km: 850,
    min: 365,
  },
  Ekanom: {
    img: "https://www.spot.uz/media/img/2018/06/QncGt115284046749963_l.jpg",
    bepul: 3,
    bkm: 1,
    bosh: 4100,
    kutish: 550,
    km: 970,
    min: 415,
  },
  Komfort: {
    img: "https://www.spot.uz/media/img/2018/06/QncGt115284046749963_l.jpg",
    bepul: 3,
    bkm: 1,
    bosh: 5200,
    kutish: 600,
    km: 1250,
    min: 520,
  },
  Biznes: {
    img: "https://api.uznews.uz/storage/uploads/posts/images/21012/inner/bAJt0vlI98.jpg",
    bepul: 3,
    bkm: 1,
    bosh: 10000,
    kutish: 700,
    km: 2500,
    min: 690,
  },
  Yetkazish: {
    img: "https://site-5202e00.1c-umi.ru/images/cms/thumbs/a5b0aeaa3fa7d6e58d75710c18673bd7ec6d5f6d/scale_1200-4-1_250_auto.jpg",
    bepul: 3,
    bkm: 1,
    bosh: 4000,
    kutish: 500,
    km: 1550,
    min: 0,
  },
  Yuk: {
    img: "https://www.spot.uz/media/img/2020/11/WigOpH16063594995236_l.jpg",
    bepul: 10,
    bkm: 6,
    bosh: 42000,
    kutish: 650,
    km: 1500,
    min: 750,
  },
};

const show_definition = async (chatId, name) => {
  bot.sendPhoto(chatId, definitions[name].img, {
    caption: `Sultan Taxi - Yandex Go hamkori\n\n${name}\nKursi "Soat atrofida\nHar kuni 00:00 dan 23:59 gacha\n\nMinimal narx (${definitions[name].bkm} km ni o'z ichiga olgan holda) - ${definitions[name].bosh} so'm\n1) Minimal narx - ${definitions[name].bosh} so'm\n2)Bepul kutish - ${definitions[name].bepul} daq\n3) Pulli kutish - ${definitions[name].bepul} so'm/min dan ko'p emas\n4) Shahar bo'ylab - ${definitions[name].km} so'm/km dan ko'p emas, ${definitions[name].min} so'm/min`,
  });
};

module.exports = {
  get_all_definitions,
  show_definition,
};

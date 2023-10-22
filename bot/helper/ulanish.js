const { bot } = require("../bot");
const User = require("../../model/user");
const Doc = require("../../model/documents");

// const clear_draft_docs = async () => {
//   let docs = await Doc.find({ status: 0 }).lean();
//   if (docs) {
//     await Promise.all(
//       docs.map(async (doc) => {
//         await Office.findByIdAndRemove(doc._id);
//       })
//     );
//   }
// };

const get_docs = async (chatId) => {
  //   clear_draft_docs();
  const user = await User.findOne({ chatId }).lean();
  const newDocs = new Doc({
    status: 0,
  });
  await newDocs.save();
  await User.findByIdAndUpdate(
    user._id,
    { ...user, action: "get_docs_img_first" },
    { new: true }
  );
  bot.sendMessage(
    chatId,
    "🚖 Haydovchi bo'lish uchun ro'yhatdan o'tishni boshleymiz\n\n Ro'yhatdan o'tish atigi 4 ta qadamdan iborat. 🤝"
  );
  bot.sendPhoto(chatId, "https://daryo.uz/cache/2019/09/5649651-680x427.jpg", {
    caption: "Menga haydovchilik guvohnomasini OLDI tomonini jo'nating!",
  });
};

const steps = {
  img_first: {
    action: "get_docs_img_second",
    image: "https://lex.uz/files/3241184",
    text: "🚗 Menga avtomobilingiz texnik pasportini OLDI tarafini rasmini jo'nating...",
  },
  img_second: {
    action: "get_docs_img_third",
    image: "https://lex.uz/files/3131206",
    text: "🚗 Menga avtomobilingiz texnik pasportini ORQA tarafini rasmini jo'nating...",
  },
  img_third: {
    action: "get_docs_mobile",
    text: "📞 Telefon raqamingizni jo'nating. +998931234567 shu ko'rinishida",
  },
};

const get_docs_next = async (chatId, value, slug) => {
  const user = await User.findOne({ chatId }).lean();
  const doc = await Doc.findOne({ status: 0 }).lean();
  if (["img_first", "img_second", "img_third", "mobile"].includes(slug)) {
    doc[slug] = value;

    if (slug === "mobile") {
      doc.status = 1;
      bot.sendMessage(
        chatId,
        "Hujjatlariz qabul qilindi, Operatorlarimiz tez orada siz bilan bo'glanishadi, Biz bilan hamkorligizdan hursandmiz! 👏🏻"
      );
      bot.sendPhoto("907107255", doc.img_first);
      bot.sendPhoto("907107255", doc.img_second);
      bot.sendPhoto("907107255", doc.img_third);
      bot.sendMessage(
        "907107255",
        `Telefon raqami ${doc.mobile}, username: ${user.phone}`
      );
      await User.findByIdAndUpdate(
        user._id,
        { ...user, action: "menu" },
        { new: true }
      );
    } else if (["img_first", "img_second"].includes(slug)) {
      await User.findByIdAndUpdate(
        user._id,
        {
          ...user,
          action: steps[slug].action,
        },
        { new: true }
      );
      bot.sendPhoto(chatId, steps[slug].image, {
        caption: steps[slug].text,
      });
    } else {
      await User.findByIdAndUpdate(
        user._id,
        {
          ...user,
          action: steps[slug].action,
        },
        { new: true }
      );
      bot.sendMessage(chatId, steps[slug].text);
    }

    await Doc.findByIdAndUpdate(doc._id, doc, { new: true });
  }
};

module.exports = { get_docs, get_docs_next };

const { bot } = require("./bot");
const User = require("../model/user");
const Office = require("../model/office");
const { start, get_pay_bot } = require("./helper/start");
const { get_all_definitions, show_definition } = require("./helper/tariflar");
const { get_all_office } = require("./helper/about");
const { add_office, add_office_next, show_office } = require("./helper/office");
const { get_docs, get_docs_next } = require("./helper/ulanish");

bot.on("message", async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;
  const user = await User.findOne({ chatId }).lean();
  const offices = await Office.find({ status: 1 }).lean();
  const list = await offices.map((office) => office.title);

  if (text === "/start") {
    start(msg);
  }

  if (user) {
    if (text) {
      if (text.includes("Tariflar")) {
        get_all_definitions(chatId);
      }

      if (text.includes("Haydovchi bo'lish")) {
        get_docs(chatId);
      }

      if (text.includes("SULTAN TAXI MA'LUMOT")) {
        get_all_office(chatId);
        return;
      }

      if (text.includes("Orqaga")) {
        await User.findByIdAndUpdate(
          user._id,
          { ...user, action: "menu" },
          { new: true }
        );
        start(msg);
        return;
      }

      if (text.includes("Asosiy")) {
        await User.findByIdAndUpdate(
          user._id,
          { ...user, action: "menu" },
          { new: true }
        );
        start(msg);
        return;
      }

      if (
        text.includes("Offise qo'shish") &&
        user.action === "get_office_location"
      ) {
        add_office(chatId);
      }

      if (text.includes("Pozivnoydan pul yechish")) {
        get_pay_bot(chatId);
      }

      if (list.length) {
        if (list.includes(text)) {
          const office = await Office.findOne({ title: text }).lean();
          show_office(chatId, office._id);
        }
      }

      if (
        [
          "Start",
          "Ekanom",
          "Komfort",
          "Biznes",
          "Yetkazish",
          "Yuk Tashish",
        ].includes(text.substring(2, text.length))
      ) {
        show_definition(chatId, text.substring(2, text.length).split(" ")[0]);
      }
    }

    if (user.action === "new_office_title") {
      add_office_next(chatId, text, "title");
    }
    if (user.action === "new_office_username") {
      add_office_next(chatId, text, "username");
    }

    if (user.action === "new_office_img") {
      if (msg.photo) {
        add_office_next(chatId, msg.photo.at(-1).file_id, "img");
      } else {
        bot.sendMessage(
          chatId,
          "Mahsulot rasmini oddiy rasm ko'rinishida yuklang"
        );
      }
    }
    if (user.action === "new_office_mobile") {
      add_office_next(chatId, text, "mobile");
    }

    if (user.action === "get_docs_img_first") {
      if (msg.photo) {
        get_docs_next(chatId, msg.photo.at(-1).file_id, "img_first");
      } else {
        bot.sendMessage(
          chatId,
          "Mahsulot rasmini oddiy rasm ko'rinishida yuklang"
        );
      }
    }
    if (user.action === "get_docs_img_second") {
      if (msg.photo) {
        get_docs_next(chatId, msg.photo.at(-1).file_id, "img_second");
      } else {
        bot.sendMessage(
          chatId,
          "Mahsulot rasmini oddiy rasm ko'rinishida yuklang"
        );
      }
    }
    if (user.action === "get_docs_img_third") {
      if (msg.photo) {
        get_docs_next(chatId, msg.photo.at(-1).file_id, "img_third");
      } else {
        bot.sendMessage(
          chatId,
          "Mahsulot rasmini oddiy rasm ko'rinishida yuklang"
        );
      }
    }

    if (user.action === "get_docs_mobile") {
      get_docs_next(chatId, text, "mobile");
    }
  }
});

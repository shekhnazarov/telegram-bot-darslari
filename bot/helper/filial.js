const { bot } = require("../bot");
const User = require("../../model/users");
const Filiallar = require("../../model/filiallar");

const get_all_filiallar = async (msg) => {
  let chatId = msg.from.id;
  let user = await User.findOne({ chatId }).lean();
  let filiallar = await Filiallar.find().lean();
  let list = filiallar.map((filial) => {
    return [
      {
        text: filial.title,
      },
    ];
  });

  bot.sendMessage(chatId, "O'zingizga kerakli bo'lgan filialni tanlang", {
    reply_markup: {
      keyboard: [
        ...list,
        user.admin
          ? [
              {
                text: "Yangi filial qo'shish",
              },
            ]
          : [],
      ],
      resize_keyboard: true,
    },
  });
};

const add_filial = async (msg) => {
  let chatId = msg.from.id;
  let user = await User.findOne({ chatId }).lean();
  if (user.admin) {
    await User.findByIdAndUpdate(
      user._id,
      {
        ...user,
        action: "add_filial",
      },
      {
        new: "true",
      }
    );

    bot.sendMessage(chatId, "Yangi filial nomini kiriting:");
  } else {
    bot.sendMessage(chatId, "Sizga bunday so'rov mumkin emas");
  }
};

const new_filial = async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;
  bot.on();

  // let user = await User.findOne({ chatId }).lean();
  // if (user.admin && user.action === "add_filial") {
  //   let newFilial = new Filiallar({
  //     title: text,
  //   });

  //   await newFilial.save();
  //   await User.findByIdAndUpdate(user._id, {
  //     ...user,
  //     action: "Filiallar",
  //   });
  //   } else {
  //     bot.sendMessage(chatId, "Sizga bunday so'rov mumkin emas");
  //   }
};

// const new_category = async (msg) => {
//   const chatId = msg.from.id;
//   const text = msg.text;

//   let user = await User.findOne({ chatId }).lean();
//   if (user.admin && user.action === "add_category") {
//     let newCategory = new Category({
//       title: text,
//     });

//     await newCategory.save();
//     await User.findByIdAndUpdate(user._id, {
//       ...user,
//       action: "category",
//     });
//     get_all_categories(msg);
//   } else {
//     bot.sendMessage(chatId, "Sizga bunday sorov mumkin emas");
//   }
// };

module.exports = {
  get_all_filiallar,
  add_filial,
  new_filial,
};

const { bot } = require("../bot");
const User = require("../../model/users");
const Filial = require("../../model/filial");

const get_all_filiallar = async (chatId, page = 1) => {
  let user = await User.findOne({ chatId }).lean();
  let limit = 7;
  let skip = (page - 1) * limit;
  let filiallar = await Filial.find().skip(skip).limit(limit).lean();
  let list = filiallar.map((filial) => {
    return [
      {
        text: filial.title,
        callback_data: `filial_${filial._id}`,
      },
    ];
  });
  let lenz = (await Filial.find().lean()).length;
  bot.sendMessage(chatId, "Barcha filiallar ro'yhati:", {
    reply_markup: {
      remove_keyboard: true,
      inline_keyboard: [
        ...list,
        [
          {
            text: "Ortga",
            callback_data: page > 1 ? "prev_filial" : page,
          },
          {
            text: page,
            callback_data: "0",
          },
          {
            text: "Keyingi",
            callback_data: !(page * limit >= lenz) ? "next_filial" : page,
          },
        ],
        user.admin
          ? [
              {
                text: "Yangi filial qo'shish",
                callback_data: "add_filial",
              },
            ]
          : [],
      ],
    },
  });
};

const add_filial = async (chatId) => {
  let user = await User.findOne({ chatId }).lean();

  if (user.admin) {
    await User.findByIdAndUpdate(
      user._id,
      { ...user, action: "add_filial" },
      { new: true }
    );

    bot.sendMessage(chatId, "Yangi filial nomini kiriting: ");
  } else {
    bot.sendMessage(chatId, "Sizga bunday so'rov mumkin emas");
  }
};

const new_filial = async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;

  let user = await User.findOne({ chatId }).lean();
  if (user.admin && user.action === "add_filial") {
    let newFilial = new Filial({
      title: text,
    });

    await newFilial.save();
    await User.findByIdAndUpdate(
      user._id,
      { ...user, action: "filial" },
      { new: true }
    );
    get_all_filiallar(chatId);
  } else {
    bot.sendMessage(chatId, "Sizga bunday sorov mumkin emas");
  }
};

const show_filial = async (chatId, id) => {
  let filial = await Filial.findById(id).lean();
  let user = await User.findOne({ chatId }).lean();
  await User.findByIdAndUpdate(user._id, {
    ...user,
    action: `filial_${filial._id}`,
  });
  bot.sendMessage(chatId, `${filial.title} filialimiz`, {
    reply_markup: {
      remove_keyboard: true,
      inline_keyboard: [
        user.admin
          ? [
              {
                text: "Filialni tahrirlash",
                callback_data: `edit_filial-${filial._id}`,
              },
              {
                text: "Filialni o'chirish",
                callback_data: `del_filial-${filial._id}`,
              },
            ]
          : [],
      ],
    },
  });
};

const edit_filial = async (chatId, id) => {
  let user = await User.findOne({ chatId }).lean();
  let filial = await Filial.findById(id).lean();
  await User.findByIdAndUpdate(
    user._id,
    { ...user, action: `edit_filial-${id}` },
    { new: true }
  );
  bot.sendMessage(chatId, `${filial.title} filialga yangi nom bering:`);
};

const save_filial = async (chatId, title) => {
  let user = await User.findOne({ chatId }).lean();
  await User.findByIdAndUpdate(
    user._id,
    { ...user, action: `menu` },
    { new: true }
  );
  let id = user.action.split("-")[1];
  let filial = await Filial.findById(id).lean();
  await Filial.findByIdAndUpdate(id, { ...filial, title }, { new: true });
  bot.sendMessage(chatId, "Filial yangilandi. \nMenyudan tanlang");
};

const remove_filial = async (chatId, id) => {
  let user = await User.findOne({ chatId }).lean();
  let filial = await Filial.findById(id).lean();
  if (user.action !== "del_category") {
    await User.findByIdAndUpdate(
      user._id,
      { ...user, action: "del_category" },
      { new: true }
    );
    bot.sendMessage(
      chatId,
      `Siz ${filial.title} filialni o'chirmoqchimisiz, qaroringiz qatiymi`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Bekor qilish",
                callback_data: `filial_${filial._id}`,
              },
              {
                text: "O'chirish",
                callback_data: `del_filial-${filial._id}`,
              },
            ],
          ],
        },
      }
    );
  } else {
    await Filial.findByIdAndRemove(id);
    bot.sendMessage(
      chatId,
      `${filial.title} filial o'chirildi, Menyudan tanleng`
    );
  }
};

module.exports = {
  get_all_filiallar,
  add_filial,
  new_filial,
  show_filial,
  edit_filial,
  save_filial,
  remove_filial,
};

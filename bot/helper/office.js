const { bot } = require("../bot");
const User = require("../../model/user");
const Office = require("../../model/office");

const add_office = async (chatId) => {
  const user = await User.findOne({ chatId }).lean();
  if (user.admin) {
    let newOffice = new Office({
      status: 0,
    });

    await newOffice.save();
    await User.findByIdAndUpdate(
      user._id,
      {
        ...user,
        action: "new_office_title",
      },
      { new: true }
    );
    bot.sendMessage(chatId, "Yangi office nomini kiriting:");
  } else {
    bot.sendMessage(chatId, "Sizga bunday so'rovlar mumkin emas");
  }
};

const steps = {
  title: {
    action: "new_office_username",
    text: "Yangi office telegram usernameni kiriting:",
  },
  username: {
    action: "new_office_img",
    text: "Yangi office rasmini kiriting:",
  },
  img: {
    action: "new_office_mobile",
    text: "Yangi office raqamini kiriting:",
  },
};

const add_office_next = async (chatId, value, slug) => {
  const user = await User.findOne({ chatId }).lean();
  const office = await Office.findOne({ status: 0 }).lean();
  if (["title", "username", "img", "mobile"].includes(slug)) {
    office[slug] = value;
    if (slug === "mobile") {
      office.status = 1;
      bot.sendMessage(chatId, "Yangi office kiritildi:");
      await User.findByIdAndUpdate(user._id, {
        ...user,
        action: "get_all_office",
      });
    } else {
      await User.findByIdAndUpdate(user._id, {
        ...user,
        action: steps[slug].action,
      });
      bot.sendMessage(chatId, steps[slug].text);
    }

    await Office.findByIdAndUpdate(office._id, office, { new: true });
  }
};

const clear_draft_office = async () => {
  let offices = await Office.find({ status: 0 }).lean();
  if (offices) {
    await Promise.all(
      offices.map(async (office) => {
        await Office.findByIdAndRemove(office._id);
      })
    );
  }
};

const show_office = async (chatId, id) => {
  const user = await User.findOne({ chatId }).lean();
  const office = await Office.findById(id).lean();
  bot.sendPhoto(chatId, office.img, {
    caption: `📍 ${office.title} office\n\n👤 Admin: @${office.username}\n\n📞 Telefon: +${office.mobile}`,
    reply_markup: {
      inline_keyboard: [
        user.admin
          ? [
              {
                text: "✏️ Officeni tahrirlash",
                callback_data: `edit_office-${office._id}`,
              },
              {
                text: "🗑 Officeni o'chirish",
                callback_data: `del_office-${office._id}`,
              },
            ]
          : [],
      ],
    },
  });
};

const delete_office = async (chatId, id, sure) => {
  const user = await User.findOne({ chatId }).lean();
  if (user.admin) {
    if (sure) {
      await Office.findByIdAndRemove(id);
      bot.sendMessage(chatId, "Office o'chirildi!");
    } else {
      bot.sendMessage(
        chatId,
        "Officeni o'chirmoqchimisz, qaroringiz qa'tiymi ?",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🙅‍♂️ Yo'q",
                  callback_data: "offices",
                },
                {
                  text: "✅ Ha",
                  callback_data: `remove_office-${id}`,
                },
              ],
            ],
          },
        }
      );
    }
  }
};

module.exports = {
  add_office,
  add_office_next,
  clear_draft_office,
  show_office,
  delete_office,
};

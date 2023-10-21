const { bot } = require("../bot");
const User = require("../../model/user");
const Office = require("../../model/office");

const add_office = async (chatId) => {
  const newOffice = new Office({
    status: 0,
  });

  await newOffice.save();
  let user = await User.findOne({ chatId }).lean();
  await User.findByIdAndUpdate(
    user._id,
    {
      ...user,
      action: "new_office_title",
    },
    { new: true }
  );
  bot.sendMessage(chatId, "Yangi office nomini kiriting:");
};

const steps = {
  title: {
    action: "new_office_username",
    text: "Officening telegram usernamini kiriting:",
  },
  username: {
    action: "new_office_img",
    text: "Office rasmini kiriting",
  },
  img: {
    action: "new_office_mobile",
    text: "Offisening telefon raqamini kiriting",
  },
};

const add_office_next = async (chatId, value, slug) => {
  let user = await User.findOne({ chatId }).lean();
  const office = await Office.findOne({ status: 0 }).lean();
  if (["title", "mobile", "username", "img"].includes(slug)) {
    office[slug] = value;

    if (slug === "mobile") {
      office.status = 1;
      bot.sendMessage(chatId, "Yangi office kiritildi");
      await User.findOneAndUpdate(user._id, {
        ...user,
        action: "katalog",
      });
    } else {
      await User.findOneAndUpdate(user._id, {
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

module.exports = { add_office, add_office_next, clear_draft_office };

const { bot } = require("../bot");
const User = require("../../model/users");
const Category = require("../../model/category");
const Product = require("../../model/product");
const { clear_draft_product } = require("./product");

const get_all_categories = async (chatId, page = 1) => {
  clear_draft_product();
  let user = await User.findOne({ chatId }).lean();
  let limit = 5;
  let skip = (page - 1) * limit;
  if (page == 1) {
    await User.findByIdAndUpdate(
      user._id,
      { ...user, action: "category-1" },
      { new: true }
    );
  }
  let lenz = (await Category.find().lean()).length;
  let categories = await Category.find().skip(skip).limit(limit).lean();
  let list = categories.map((category) => {
    return [
      {
        text: category.title,
        callback_data: `category_${category._id}`,
      },
    ];
  });
  bot.sendMessage(chatId, "Kategoriyalar royhati:", {
    reply_markup: {
      remove_keyboard: true,
      inline_keyboard: [
        ...list,
        [
          {
            text: "Ortga",
            callback_data: page > 1 ? "back_category" : page,
          },
          {
            text: page,
            callback_data: "0",
          },
          {
            text: "keyingi",
            callback_data: !(page * 5 >= lenz) ? "next_category" : page,
          },
        ],
        user?.admin
          ? [
              {
                text: "Yangi kategoriya",
                callback_data: "add_category",
              },
            ]
          : [],
      ],
    },
  });
};

const add_category = async (chatId) => {
  let user = await User.findOne({ chatId }).lean();

  if (user.admin) {
    await User.findByIdAndUpdate(
      user._id,
      {
        ...user,
        action: "add_category",
      },
      { new: true }
    );

    bot.sendMessage(chatId, "Yangi kategoriya nomini kiriting: ");
  } else {
    bot.sendMessage(chatId, "Sizga bunday so'rov mumkin emas");
  }
};

const new_category = async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;

  let user = await User.findOne({ chatId }).lean();
  if (user.admin && user.action === "add_category") {
    let newCategory = new Category({
      title: text,
    });

    await newCategory.save();
    await User.findByIdAndUpdate(user._id, {
      ...user,
      action: "category",
    });
    get_all_categories(chatId);
  } else {
    bot.sendMessage(chatId, "Sizga bunday sorov mumkin emas");
  }
};

const pagination_category = async (chatId, action) => {
  let user = await User.findOne({ chatId }).lean();
  let page = 1;
  if (user.action.includes("category-")) {
    page = +user.action.split("-")[1];
    if (action == "back_category" && page > 1) {
      page--;
    }
  }
  if (action == "next_category") {
    page++;
  }
  await User.findByIdAndUpdate(
    user._id,
    {
      ...user,
      action: `category-${page}`,
    },
    { new: true }
  );
  get_all_categories(chatId, page);
};

const show_category = async (chatId, id, page = 1) => {
  let category = await Category.findById(id).lean();
  let user = await User.findOne({ chatId }).lean();
  await User.findByIdAndUpdate(user._id, {
    ...user,
    action: `category_${category._id}`,
  });
  let limit = 5;
  let skip = (page - 1) * limit;
  let products = await Product.find({ category: category._id, status: 1 })
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 })
    .lean();
  let list = products.map((product) => {
    return [
      {
        text: product.title,
        callback_data: `product_${product._id}`,
      },
    ];
  });
  let lenz = (await Product.find().lean()).length;
  const userKeyboard = [];
  const adminKeyboard = [
    [
      {
        text: "Yangi mahsulot",
        callback_data: `add_product-${category._id}`,
      },
    ],
    [
      {
        text: "Turkumni tahrirlash",
        callback_data: `edit_category-${category._id}`,
      },
      {
        text: "Turkumni o'chirish",
        callback_data: `del_category-${category._id}`,
      },
    ],
  ];
  const keyboard = user.admin ? adminKeyboard : userKeyboard;
  bot.sendMessage(
    chatId,
    `${category.title} turkumidagi mahsulotlar ro'yhati:`,
    {
      reply_markup: {
        remove_keyboard: true,
        inline_keyboard: [
          ...list,
          [
            {
              text: "Ortga",
              callback_data: page > 1 ? "back_product" : page,
            },
            {
              text: page,
              callback_data: "0",
            },
            {
              text: "keyingi",
              callback_data: !(page * limit >= lenz) ? "next_product" : page,
            },
          ],
          ...keyboard,
        ],
      },
    }
  );
};

const remove_category = async (chatId, id) => {
  let user = await User.findOne({ chatId }).lean();
  let category = await Category.findById(id).lean();
  if (user.action !== "del_category") {
    await User.findByIdAndUpdate(
      user._id,
      { ...user, action: "del_category" },
      { new: true }
    );
    bot.sendMessage(
      chatId,
      `Siz ${category.title} turkumni o'chirmoqchimisiz, qaroringiz qatiymi`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Bekor qilish",
                callback_data: `category_${category._id}`,
              },
              {
                text: "O'chirish",
                callback_data: `del_category-${category._id}`,
              },
            ],
          ],
        },
      }
    );
  } else {
    let products = await Product.find({ category: category._id })
      .select(["_id"])
      .lean();

    await Promise.all(
      products.map(async (product) => {
        await Product.findByIdAndRemove(product._id);
      })
    );

    await Category.findByIdAndRemove(id);

    bot.sendMessage(
      chatId,
      `${category.title} turkumi o'chirildi, Menyudan tanleng`
    );
  }
};

const edit_category = async (chatId, id) => {
  let user = await User.findOne({ chatId }).lean();
  let category = await Category.findById(id).lean();
  await User.findByIdAndUpdate(
    user._id,
    { ...user, action: `edit_category-${id}` },
    { new: true }
  );
  bot.sendMessage(chatId, `${category.title} turkumga yangi nom bering:`);
};

const save_category = async (chatId, title) => {
  let user = await User.findOne({ chatId }).lean();
  await User.findByIdAndUpdate(
    user._id,
    { ...user, action: `menu` },
    { new: true }
  );
  let id = user.action.split("-")[1];
  let category = await Category.findById(id).lean();
  await Category.findByIdAndUpdate(id, { ...category, title }, { new: true });
  bot.sendMessage(chatId, "Turkum yangilandi. \nMenyudan tanlang");
};
module.exports = {
  get_all_categories,
  add_category,
  new_category,
  pagination_category,
  show_category,
  remove_category,
  edit_category,
  save_category,
};

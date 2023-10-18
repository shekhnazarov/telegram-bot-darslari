const { bot } = require("../bot");
const User = require("../../model/users");
const Product = require("../../model/product");

const add_product = async (chatId, category) => {
  const newProduct = new Product({
    category,
    status: 0,
  });

  await newProduct.save();
  let user = await User.findOne({ chatId }).lean();
  await User.findByIdAndUpdate(
    user._id,
    {
      ...user,
      action: "new_product_title",
    },
    { new: true }
  );
  bot.sendMessage(chatId, "Yangi mahsulot nomini kiriting:");
};

const steps = {
  title: {
    action: "new_product_price",
    text: "Mahsulot narxini kiriting",
  },
  price: {
    action: "new_product_img",
    text: "Mahsulot rasmini kiriting",
  },
  img: {
    action: "new_product_text",
    text: "Mahsulot haqida qisqa tafsilot kiriting",
  },
};

const add_product_next = async (chatId, value, slug) => {
  let user = await User.findOne({ chatId }).lean();
  let product = await Product.findOne({ status: 0 }).lean();
  if (["title", "text", "price", "img"].includes(slug)) {
    product[slug] = value;

    if (slug === "text") {
      product.status = 1;
      bot.sendMessage(chatId, "Yangi mahsulot kiritildi");
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

    await Product.findByIdAndUpdate(product._id, product, { new: true });
  }
};

const clear_draft_product = async () => {
  let products = await Product.find({ status: 0 }).lean();
  if (products) {
    await Promise.all(
      products.map(async (product) => {
        await Product.findByIdAndRemove(product._id);
      })
    );
  }
};

const show_product = async (chatId, id) => {
  let user = await User.findOne({ chatId }).lean();
  let product = await Product.findById(id).populate(["category"]).lean();
  console.log(product);
  bot.sendPhoto(chatId, product.img, {
    caption: `<b>${product.title}</b>\nTurkum: <i>${product.category.title}</i> \nNarxi: ${product.price}\nQisqa ma'lumot: ${product.text}`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "-",
            callback_data: "less_count",
          },
          {
            text: "1",
            callback_data: "1",
          },
          {
            text: "+",
            callback_data: "more_count",
          },
        ],
        user.admin
          ? [
              {
                text: "✏️ Mahsulotni tahrirlash",
                callback_data: `edit_product-${product._id}`,
              },
              {
                text: "🗑 Mahsulotni o'chirish",
                callback_data: `del_product-${product._id}`,
              },
            ]
          : [],
        [
          {
            text: "🛒 Korzinkaga qo'shish",
            callback_data: "add_cart",
          },
        ],
      ],
    },
  });
};

const delete_product = async (chatId, id, sure) => {
  let user = await User.findOne({ chatId }).lean();
  if (user.admin) {
    if (sure) {
      await Product.findByIdAndRemove(id);
      bot.sendMessage(chatId, "Mahsulot o'chirildi");
    } else {
      bot.sendMessage(
        chatId,
        "Mahsulotni o'chirmoqchisiz, qaroringiz qattiymi?",
        {
          reply_markup: {
            inline_keyboard: [
              {
                text: "Yo'q",
                callback_data: "catalog",
              },
              {
                text: "Ha",
                callback_data: `remove_product-${id}`,
              },
            ],
          },
        }
      );
    }
  } else {
    bot.sendMessage(chatId, "sizga bunday so'rov mumkin emas");
  }
};

module.exports = {
  add_product,
  add_product_next,
  clear_draft_product,
  show_product,
  delete_product,
};

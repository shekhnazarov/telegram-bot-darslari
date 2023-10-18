const { bot } = require("./bot");
const {
  add_category,
  pagination_category,
  show_category,
  remove_category,
  edit_category,
  get_all_categories,
} = require("./helper/category");

const {
  add_filial,
  show_filial,
  edit_filial,
  remove_filial,
} = require("./helper/filial");
const {
  add_product,
  show_product,
  delete_product,
} = require("./helper/product");

bot.on("callback_query", async (query) => {
  const { data } = query;
  const chatId = query.from.id;
  if (data === "add_category") {
    add_category(chatId);
  }

  if (data === "add_filial") {
    add_filial(chatId);
  }

  if (["next_category", "back_category"].includes(data)) {
    pagination_category(chatId, data);
  }

  if (data.includes("category_")) {
    let id = data.split("_")[1];
    show_category(chatId, id);
  }

  if (data.includes("filial_")) {
    let id = data.split("_")[1];
    show_filial(chatId, id);
  }

  if (data.includes("del_category-")) {
    let id = data.split("-")[1];
    remove_category(chatId, id);
  }

  if (data.includes("del_filial-")) {
    let id = data.split("-")[1];
    remove_filial(chatId, id);
  }

  if (data.includes("edit_category-")) {
    let id = data.split("-")[1];
    edit_category(chatId, id);
  }
  if (data.includes("edit_filial-")) {
    let id = data.split("-")[1];
    edit_filial(chatId, id);
  }

  if (data.includes("add_product-")) {
    let id = data.split("-")[1];
    add_product(chatId, id);
  }

  if (data.includes("product_")) {
    let id = data.split("_")[1];
    show_product(chatId, id);
  }

  if (data.includes("del_product-")) {
    let id = data.split("-")[1];
    delete_product(chatId, id, false);
  }

  if (data.includes("remove_product-")) {
    let id = data.split("-")[1];
    delete_product(chatId, id, true);
  }
  if (data === "catalog") {
    get_all_categories(chatId);
  }
});

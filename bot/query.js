const { bot } = require("./bot");
const { get_all_office } = require("./helper/about");
const { delete_office } = require("./helper/office");

bot.on("callback_query", async (query) => {
  const { data } = query;
  const chatId = query.from.id;

  if (data.includes("del_office-")) {
    const id = data.split("-")[1];
    delete_office(chatId, id, false);
  }
  if (data.includes("remove_office-")) {
    const id = data.split("-")[1];
    delete_office(chatId, id, true);
    get_all_office(chatId);
  }

  if (data === "offices") {
    get_all_office(chatId);
  }
});

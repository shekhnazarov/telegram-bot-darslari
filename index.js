const express = require("express");
const app = express();
const mongoose = require("mongoose");
const TELEGRAM_BOT = require("node-telegram-bot-api");

app.use(express.json());

const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/technomagazin";
const TOKEN = "6024298147:AAGkMzvRz9aXK7-Ux64ADMVLtYwG-xoj7A4";

const bot = new TELEGRAM_BOT(TOKEN, { polling: true });

// const User = require("./model/user");
const lotinHarflar = "abcdefghijklmnopqrstuvwxyz";

const translateLotin = (text) => {
  try {
    let result = "";
    let a = {};
    a["Ё"] = "Yo";
    a["Й"] = "Y";
    a["Ц"] = "Ts";
    a["У"] = "U";
    a["К"] = "K";
    a["Е"] = "E";
    a["Н"] = "N";
    a["Г"] = "G";
    a["Ш"] = "Sh";
    a["Щ"] = "Sh";
    a["З"] = "Z";
    a["Х"] = "X";
    a["Ъ"] = "'";
    a["ё"] = "yo";
    a["й"] = "y";
    a["ц"] = "ts";
    a["у"] = "u";
    a["к"] = "k";
    a["е"] = "e";
    a["н"] = "n";
    a["г"] = "g";
    a["ш"] = "sh";
    a["щ"] = "sh";
    a["з"] = "z";
    a["х"] = "x";
    a["ъ"] = "'";
    a["Ф"] = "F";
    a["Ы"] = "I";
    a["В"] = "V";
    a["А"] = "a";
    a["П"] = "P";
    a["Р"] = "R";
    a["О"] = "O";
    a["Л"] = "L";
    a["Д"] = "D";
    a["Ж"] = "J";
    a["Ҳ"] = "H";
    a["Э"] = "E";
    a["ф"] = "f";
    a["ы"] = "i";
    a["в"] = "v";
    a["а"] = "a";
    a["п"] = "p";
    a["р"] = "r";
    a["о"] = "o";
    a["л"] = "l";
    a["ҳ"] = "h";
    a["д"] = "d";
    a["ж"] = "j";
    a["э"] = "e";
    a["Я"] = "Ya";
    a["Ч"] = "Ch";
    a["С"] = "S";
    a["М"] = "M";
    a["И"] = "I";
    a["Т"] = "T";
    a["Б"] = "B";
    a["Ю"] = "Yu";
    a["я"] = "ya";
    a["ч"] = "ch";
    a["с"] = "s";
    a["м"] = "m";
    a["и"] = "i";
    a["т"] = "t";
    a["б"] = "b";
    a["ю"] = "yu";
    a["қ"] = "q";
    a["Қ"] = "Q";
    a["ў"] = "o'";
    a["Ў"] = "O'";
    a["ғ"] = "g'";
    a["Ғ"] = "G'";
    a["Ь"] = "";
    a["ь"] = "";
    if (text === "/krill-lotin") {
      result = "";
    }
    for (let i = 0; i < text.length; i++) {
      if (text.hasOwnProperty(i)) {
        if (a[text[i]] === undefined) {
          result += text[i];
        } else {
          result += a[text[i]];
        }
      }
    }

    return result;
  } catch (err) {
    console.log(err);
  }
};

const translateKrill = (word) => {
  try {
    let result = "";
    let a = {};
    a["A"] = "А";
    a["B"] = "Б";
    a["D"] = "Д";
    a["E"] = "Е";
    a["F"] = "Ф";
    a["G"] = "Г";
    a["H"] = "Ҳ";
    a["I"] = "И";
    a["J"] = "Ж";
    a["K"] = "К";
    a["L"] = "Л";
    a["M"] = "М";
    a["N"] = "Н'";
    a["O"] = "О";
    a["P"] = "П";
    a["Q"] = "Қ";
    a["R"] = "Р";
    a["S"] = "С";
    a["T"] = "Т";
    a["U"] = "У";
    a["V"] = "В";
    a["X"] = "Х'";
    a["Y"] = "Й";
    a["Z"] = "З";
    a["Ō"] = "Ў";
    a["Ğ"] = "Ғ";
    a["Ş"] = "Ш";
    a["Ć"] = "Ч";
    a["a"] = "а";
    a["b"] = "б";
    a["d"] = "д";
    a["e"] = "е";
    a["f"] = "ф";
    a["g"] = "г";
    a["h"] = "ҳ";
    a["i"] = "и";
    a["j"] = "ж";
    a["k"] = "к";
    a["l"] = "л";
    a["m"] = "м";
    a["n"] = "н";
    a["o"] = "о";
    a["p"] = "п";
    a["q"] = "қ";
    a["r"] = "р";
    a["s"] = "с";
    a["t"] = "т";
    a["u"] = "у";
    a["v"] = "в";
    a["x"] = "х";
    a["y"] = "й";
    a["z"] = "з";
    a["ō"] = "ў";
    a["ğ"] = "ғ";
    a["ş"] = "ш";
    a["ć"] = "ч";

    for (let i = 0; i < word.length; i++) {
      if (word.hasOwnProperty(i)) {
        if (word[i] === "y" && (word[i + 1] === "a" || word[i + 1] === "H")) {
          let changes = word.split("");
          changes[i] = "я";
          changes[i + 1] = "";
          word = changes.join("");
        }
        if (word[i] === "Y" && (word[i + 1] === "a" || word[i + 1] === "H")) {
          let changes = word.split("");
          changes[i] = "Я";
          changes[i + 1] = "";
          word = changes.join("");
        }
        if (word[i] === "s" && (word[i + 1] === "h" || word[i + 1] === "H")) {
          let changes = word.split("");
          changes[i] = "ş";
          changes[i + 1] = "";
          word = changes.join("");
        }
        if (word[i] === "S" && (word[i + 1] === "h" || word[i + 1] === "H")) {
          let changes = word.split("");
          changes[i] = "Ş";
          changes[i + 1] = "";
          word = changes.join("");
        }
        if (word[i] === "c" && (word[i + 1] === "h" || word[i + 1] === "H")) {
          let changes = word.split("");
          changes[i] = "ć";
          changes[i + 1] = "";
          word = changes.join("");
        }
        if (word[i] === "C" && (word[i + 1] === "h" || word[i + 1] === "H")) {
          let changes = word.split("");
          changes[i] = "Ć";
          changes[i + 1] = "";
          word = changes.join("");
        }
        if (word[i] === "G" && (word[i + 1] === "'" || word[i + 1] === "`")) {
          let changes = word.split("");
          changes[i] = "Ğ";
          changes[i + 1] = "";
          word = changes.join("");
        }
        if (word[i] === "g" && (word[i + 1] === "'" || word[i + 1] === "`")) {
          let changes = word.split("");
          changes[i] = "ğ";
          changes[i + 1] = "";
          word = changes.join("");
        }
        if (word[i] === "O" && (word[i + 1] === "'" || word[i + 1] === "`")) {
          let changes = word.split("");
          changes[i] = "Ō";
          changes[i + 1] = "";
          word = changes.join("");
        }
        if (word[i] === "o" && (word[i + 1] === "'" || word[i + 1] === "`")) {
          let changes = word.split("");
          changes[i] = "ō";
          changes[i + 1] = "";
          word = changes.join("");
        }
        if (a[word[i]] === undefined) {
          result += word[i];
        } else {
          result += a[word[i]];
        }
      }
    }

    return result;
  } catch (err) {
    console.log(err);
  }
};

bot.on("message", async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;
  const lowerText = msg.text.toLowerCase();

  let isKrill = false;
  let isLotin = false;
  let res;
  if (text === "/start") {
    bot.sendMessage(chatId, "Assalomu aleykum");
    bot.sendMessage(
      chatId,
      "Krill-Lotin yoki Lotin-Krill ga ogirib beraman. Matn jo`nating"
    );
  } else {
    for (const harf of lowerText) {
      if (
        (harf >= "а" && harf <= "я") ||
        harf === "ғ" ||
        harf === "ё" ||
        harf === "ж" ||
        harf === "з" ||
        harf === "и" ||
        harf === "й" ||
        harf === "к" ||
        harf === "л" ||
        harf === "м" ||
        harf === "н" ||
        harf === "о" ||
        harf === "п" ||
        harf === "р" ||
        harf === "с" ||
        harf === "т" ||
        harf === "у" ||
        harf === "ф" ||
        harf === "х" ||
        harf === "ц" ||
        harf === "ч" ||
        harf === "ш" ||
        harf === "ъ" ||
        harf === "ы" ||
        harf === "ь" ||
        harf === "э" ||
        harf === "ю" ||
        harf === "я"
      ) {
        isKrill = true;
      } else if (lotinHarflar.includes(harf)) {
        isLotin = true;
      }
    }
    if (isKrill) {
      res = await translateLotin(text);
    } else if (isLotin) {
      res = await translateKrill(text);
    }
    bot.sendMessage(chatId, res);
  }
});

async function dev() {
  try {
    mongoose
      .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("MongoDb connect"))
      .catch((err) => console.log(err));

    app.listen(PORT, () => {
      console.log("Server ishga tushdi");
    });
  } catch (err) {
    console.log(err);
  }
}

dev();

const { Wechaty } = require("wechaty");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

let bot;
let botID = "";
initBot();

function initBot() {
  bot = new Wechaty({
    name: "WechatBot",
  });
  bot.on("scan", onScan);
  bot.on("login", onLogin);
  bot.on("message", onMessage);

  bot
    .start()
    .then(() => {
      console.log("Bot 启动成功");
    })
    .catch((e) => {
      console.log("Bot 启动失败", e);
    });
}

async function onScan(url, code) {
  qrcode.generate(url);
  console.log(`扫码登录: ${code}\n${url}`);
}

async function onLogin(user) {
  botID = user.id;
  console.log(`登录成功: ${user.name()}`);
}

async function fetchJoke() {
  const res = await axios.get("https://api.lovelive.tools/api/SweetNothings");
  return res.data;
}

async function onMessage(msg) {
  const msgText = msg.text().trim();
  console.log(`收到消息: ${msgText}`);
  if (msg.age() > 60) {
    console.log("已忽略: 超时消息");
    return;
  }
  if (msg.payload.fromId === botID) {
    console.log("已忽略: 机器人消息");
    return;
  }
  if (msg.payload.roomId) {
    console.log("已忽略: 群消息");
    return;
  }
  if (msg.type() !== bot.Message.Type.Text) {
    console.log("已忽略: 非文本消息");
    return;
  }
  if (msgText === "口令") {
    msg.say(`1. 输入【情话】试试\n; 2. 输入【?】试试\n`);
  }
  if (msgText === "情话") {
    const joke = await fetchJoke();
    await msg.say(joke);
  }
  if (msgText === "?" || msgText === "？") {
    await msg.say("小朋友你是不是有很多问号?");
  }
}

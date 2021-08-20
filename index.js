require("dotenv").config();
const { Telegraf } = require("telegraf");
const { BOT_TOKEN } = process.env;
const searchImage = require("./seartchImg");
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  return ctx.replyWithMarkdown(`
Hi! This is images inline bot!
Just type in any chat [@Pic_in_bot_Bot](t.me/Pic_in_bot_Bot) <image-name>
and you will receive the some images for this query
`);
});

bot.on("inline_query", async (ctx) => {
  const result = await searchImage(ctx.inlineQuery.query);
  if (!ctx.inlineQuery.query) return;
  const data = result.data.hits.map((hit) => {
    return {
      type: "photo",
      id: hit.id,
      photo_url: hit.largeImageURL,
      thumb_url: hit.previewURL,
      photo_width: 100,
      photo_height: 100,
      title: hit.tags,
      decription: hit.tags,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `${hit.likes} ❤️`,
              url: hit.pageURL,
            },
          ],
          [
            {
              text: "Share bot with friends",
              switch_inline_query: "friends",
            },
          ],
        ],
      },
    };
  });
  // console.log(data);
  console.log("я тут");
  ctx.answerInlineQuery(data);
});

bot
  .launch()
  .then((res) => console.log("Started"))
  .catch((err) => console.log("START ERROR", err));

import "dotenv/config";
import { Telegraf, Input, Markup } from "telegraf";

const token = process.env.BOT_TOKEN;
const weatherToken = process.env.WEATHER_API_KEY;

const bot = new Telegraf(token);
// TODO: Отрефакторить код, запустить его на сервер, проверить бота на человеке
const getCatGif = async (ctx) => {
  const res = await fetch("https://cataas.com/cat/gif");
  const buf = Buffer.from(await res.arrayBuffer());

  await ctx.replyWithAnimation(Input.fromBuffer(buf, "cat.gif"));
};
const getWeather = async (ctx, city = "Saint Petersburg") => {
  const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?q=${encodeURIComponent(city)}` +
    `&appid=${weatherToken}` +
    `&units=metric` +
    `&lang=ru`;
  const res = await fetch(url);
  const data = await res.json();

  const name = data.name;
  const temp = data.main.temp;
  const feels = data.main.feels_like;
  const desc = data.weather?.[0]?.description;

  await ctx.reply(
    `Погода в ${name}:\n` +
      `${desc}\n` +
      `Температура: ${temp}°C (ощущается как ${feels}°C)`,
  );
};

// bot.start((ctx) => ctx.reply('Привет! Я Эдуард Куллун и я отправляю гифки с котиками и проверяю погоду!'));
bot.help((ctx) => ctx.reply("/start, /sentGif, /getWeather, /menu"));
bot.command("sentGif", getCatGif);
// сделаем кнопку, чтобы отправляла гифу

bot.command("start", (ctx) => {
  ctx.reply(
    "Привет! Я Эдуард Куллун и я отправляю гифки с котиками и проверяю погоду!",
  );
  ctx.reply(
    "Есть два стула",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("Отправь гифку", "btn1"),
        Markup.button.callback("Скажи погоду", "btn2"),
      ],
    ]),
  );
});
bot.action("btn1", async (ctx) => {
  await ctx.answerCbQuery();
  await getCatGif(ctx);
});
bot.action("btn2", async (ctx) => {
  await ctx.answerCbQuery();
  await getWeather(ctx);
});

// getCatGif()

// // bot.start((ctx) => ctx.reply('Привет! Я Эдвард Куллун!'));
// // bot.help((ctx) => ctx.reply('Команды, которые я умею исполнять: /start, /help, /woof'));
// const getRandomInt = (min, max) => {
//   min = Math.ceil(min);
//   max = Math.floor(max);

//   return Math.floor(Math.random() * (max - min + 1) + min);
// };
// const getCoinSide = () => getRandomInt(0, 1) === 0 ? 'Орел' : 'Решка';
// const coinInlineKeyboard = Markup.inlineKeyboard([
//   Markup.button.callback('Подбросить ещё раз', 'flip_a_coin'),
// ]);
// bot.hears('Подбросить монетку', ctx => ctx.reply(getCoinSide(), coinInlineKeyboard));
// bot.action('flip_a_coin', async(ctx) => {
//   await ctx.editMessageText(`${getCoinSide()}\nОтредактировано: ${new Date().toISOString()}`, coinInlineKeyboard);
// })

// const getRandomNumber = () => getRandomInt(0, 100);
// const numberInlineKeyboard = Markup.inlineKeyboard([
//     Markup.button.callback('Сгенерировать новое', 'random_number'),
// ]);

// bot.hears('Случайное число', ctx => ctx.reply(getRandomNumber().toString(), numberInlineKeyboard));
// bot.action('random_number', async(ctx) => {
//     await ctx.editMessageText(`${getRandomNumber()}\nОтредактировано: ${new Date().toISOString()}`, numberInlineKeyboard);
// });

// bot.use(async (ctx) => {
//     await ctx.reply('Что нужно сделать?', Markup
//         .keyboard([
//             ['Подбросить монетку', 'Случайное число'],
//         ]).resize()
//     )
// });

// // bot.command('help', (ctx) => {
// //   ctx.reply(`
// //     Бот может здороваться на разных языках.
// //     Список поддерживаемых приветствий:
// //     - привет - русский
// //     - hello - английский
// //     - hola - испанский`)
// // });

// // bot.hears('привет', (ctx) => ctx.reply('привет'));
// // bot.hears('hello', (ctx) => ctx.reply('hello'));
// // bot.hears('hola', (ctx) => ctx.reply('hola'));

// // bot.on(message('text'), (ctx) => ctx.reply(`Приветствие "${ctx.update.message.text}" не поддерживается.`))

// bot.use(async (ctx) => {
//   await ctx.reply(JSON.stringify(ctx.update, null, 2));
// })

// // bot.launch().then(() => console.log('started'));

// // const middleware1 = (ctx, next) => {
// //     console.log('middleware1');
// //     next();
// // };
// // const middleware2 = (ctx, next) => {
// //     console.log('middleware2');
// // };
// // const middleware3 = (ctx, next) => {
// //     console.log('middleware3');
// // };

// // bot.use(middleware1);
// // bot.use(middleware2);
// // bot.use(middleware3);

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from '../const';
import { COMMANDS, SHORT_DESC } from './const';

const createBot = async () => {
  const bot = new Telegraf(BOT_TOKEN);
  await bot.telegram.setMyCommands(COMMANDS);
  await bot.telegram.setMyShortDescription(SHORT_DESC);
  return bot;
};
export default createBot;

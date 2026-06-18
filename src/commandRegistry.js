const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config');
const taskCommand = require('./commands/task');

async function registerGuildCommands() {
  if (!token || !clientId || !guildId) {
    console.warn('[Commands] Bỏ qua đăng ký slash command vì thiếu DISCORD_TOKEN, CLIENT_ID hoặc GUILD_ID.');
    return false;
  }

  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: [taskCommand.data.toJSON()],
  });

  console.log('[Commands] Đã đăng ký slash commands cho server thành công.');
  return true;
}

module.exports = { registerGuildCommands };

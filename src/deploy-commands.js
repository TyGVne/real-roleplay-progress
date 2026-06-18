const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config');
const taskCommand = require('./commands/task');

async function main() {
  if (!token || !clientId || !guildId) {
    console.error('Thiếu DISCORD_TOKEN, CLIENT_ID hoặc GUILD_ID trong file .env');
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: [taskCommand.data.toJSON()],
  });

  console.log('Đã deploy slash commands thành công.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

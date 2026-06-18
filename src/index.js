const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const { token, progressChannelId } = require('./config');
const taskCommand = require('./commands/task');
const { refreshDashboard } = require('./dashboard');

if (!token) {
  console.error('Thiếu DISCORD_TOKEN trong file .env');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.commands = new Collection();
client.commands.set(taskCommand.data.name, taskCommand);

client.once(Events.ClientReady, async readyClient => {
  console.log(`Bot đã online: ${readyClient.user.tag}`);
  if (progressChannelId) {
    refreshDashboard(client).catch(err => console.error('Không thể refresh dashboard:', err.message));
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    const payload = { content: 'Có lỗi xảy ra khi xử lý lệnh.', ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(payload);
    else await interaction.reply(payload);
  }
});

client.login(token);

const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const { token, progressChannelId } = require('./config');
const taskCommand = require('./commands/task');
const { refreshDashboard } = require('./dashboard');
const { registerGuildCommands } = require('./commandRegistry');

if (!token) {
  console.error('Thiếu DISCORD_TOKEN trong Variables/.env');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.commands.set(taskCommand.data.name, taskCommand);

client.once(Events.ClientReady, async readyClient => {
  console.log(`Bot đã online: ${readyClient.user.tag}`);

  // Railway chỉ chạy npm start, nên bot tự deploy slash command lúc khởi động.
  await registerGuildCommands().catch(err => {
    console.error('[Commands] Không thể đăng ký slash commands:', err.message);
  });

  if (progressChannelId) {
    await refreshDashboard(client).catch(err => {
      console.error('Không thể refresh dashboard:', err.message);
    });
  } else {
    console.warn('Thiếu PROGRESS_CHANNEL_ID nên dashboard sẽ chỉ tạo được sau khi bạn điền ID kênh.');
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return interaction.reply({ content: 'Bot chưa nhận diện được lệnh này. Hãy restart bot và thử lại.', ephemeral: true }).catch(() => null);
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error('[Interaction Error]', error);
    const payload = { content: `Có lỗi xảy ra khi xử lý lệnh: ${error.message || 'Không rõ lỗi'}`, ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(payload).catch(() => null);
    else await interaction.reply(payload).catch(() => null);
  }
});

process.on('unhandledRejection', error => {
  console.error('[UnhandledRejection]', error);
});

client.login(token);

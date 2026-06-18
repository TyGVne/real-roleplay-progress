const { progressChannelId } = require('./config');
const { readDb, writeDb } = require('./storage');
const { buildDashboardEmbed } = require('./ui');

async function refreshDashboard(client) {
  const db = readDb();
  const channel = await client.channels.fetch(progressChannelId).catch(() => null);
  if (!channel) throw new Error('Không tìm thấy PROGRESS_CHANNEL_ID. Kiểm tra lại ID kênh Discord.');

  const embed = buildDashboardEmbed(db.tasks);

  if (db.dashboardMessageId) {
    const oldMessage = await channel.messages.fetch(db.dashboardMessageId).catch(() => null);
    if (oldMessage) {
      await oldMessage.edit({ embeds: [embed] });
      return oldMessage;
    }
  }

  const message = await channel.send({ embeds: [embed] });
  db.dashboardMessageId = message.id;
  writeDb(db);
  return message;
}

module.exports = { refreshDashboard };

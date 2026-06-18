require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  progressChannelId: process.env.PROGRESS_CHANNEL_ID,
  allowedRoleId: process.env.ALLOWED_ROLE_ID || null,
};

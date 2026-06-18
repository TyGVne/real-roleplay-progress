const { PermissionFlagsBits } = require('discord.js');
const { allowedRoleId } = require('./config');

function canManage(interaction) {
  if (!interaction.member) return false;
  if (interaction.member.permissions?.has(PermissionFlagsBits.Administrator)) return true;
  if (allowedRoleId && interaction.member.roles?.cache?.has(allowedRoleId)) return true;
  return false;
}

async function requireManage(interaction) {
  if (canManage(interaction)) return true;
  await interaction.reply({ content: 'Bạn không có quyền dùng lệnh quản lý tiến độ.', ephemeral: true });
  return false;
}

module.exports = { canManage, requireManage };

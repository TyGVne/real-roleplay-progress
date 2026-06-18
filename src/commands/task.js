const { SlashCommandBuilder } = require('discord.js');
const { readDb, writeDb } = require('../storage');
const { refreshDashboard } = require('../dashboard');
const { clampProgress, progressBar, statusLabel } = require('../ui');
const { requireManage } = require('../permissions');

function findTask(db, id) {
  return db.tasks.find(task => task.id === id);
}

function nextTaskId(db) {
  const max = db.tasks.reduce((m, t) => Math.max(m, Number(t.id) || 0), 0);
  return String(max + 1);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('task')
    .setDescription('Quản lý tiến độ task Real Roleplay')
    .addSubcommand(sub => sub
      .setName('add')
      .setDescription('Thêm task mới')
      .addStringOption(opt => opt.setName('name').setDescription('Tên task').setRequired(true))
      .addIntegerOption(opt => opt.setName('progress').setDescription('Tiến độ 0-100').setMinValue(0).setMaxValue(100))
      .addStringOption(opt => opt.setName('status').setDescription('Trạng thái').addChoices(
        { name: 'Chờ làm', value: 'todo' },
        { name: 'Đang làm', value: 'doing' },
        { name: 'Chờ test', value: 'testing' },
        { name: 'Hoàn thành', value: 'done' },
        { name: 'Tạm dừng', value: 'paused' },
      ))
      .addUserOption(opt => opt.setName('assignee').setDescription('Người phụ trách'))
      .addStringOption(opt => opt.setName('deadline').setDescription('Deadline, ví dụ 20/06'))
      .addStringOption(opt => opt.setName('note').setDescription('Ghi chú')))
    .addSubcommand(sub => sub
      .setName('update')
      .setDescription('Cập nhật task')
      .addStringOption(opt => opt.setName('id').setDescription('ID task').setRequired(true))
      .addIntegerOption(opt => opt.setName('progress').setDescription('Tiến độ 0-100').setMinValue(0).setMaxValue(100))
      .addStringOption(opt => opt.setName('status').setDescription('Trạng thái').addChoices(
        { name: 'Chờ làm', value: 'todo' },
        { name: 'Đang làm', value: 'doing' },
        { name: 'Chờ test', value: 'testing' },
        { name: 'Hoàn thành', value: 'done' },
        { name: 'Tạm dừng', value: 'paused' },
      ))
      .addUserOption(opt => opt.setName('assignee').setDescription('Người phụ trách'))
      .addStringOption(opt => opt.setName('deadline').setDescription('Deadline'))
      .addStringOption(opt => opt.setName('note').setDescription('Ghi chú')))
    .addSubcommand(sub => sub
      .setName('list')
      .setDescription('Xem danh sách task'))
    .addSubcommand(sub => sub
      .setName('delete')
      .setDescription('Xoá task')
      .addStringOption(opt => opt.setName('id').setDescription('ID task').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('dashboard')
      .setDescription('Tạo/cập nhật dashboard cố định')),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    if (['add', 'update', 'delete', 'dashboard'].includes(sub)) {
      const ok = await requireManage(interaction);
      if (!ok) return;
    }

    const db = readDb();

    if (sub === 'add') {
      const assignee = interaction.options.getUser('assignee');
      const task = {
        id: nextTaskId(db),
        name: interaction.options.getString('name'),
        progress: clampProgress(interaction.options.getInteger('progress') ?? 0),
        status: interaction.options.getString('status') || 'todo',
        assignee: assignee ? `<@${assignee.id}>` : null,
        deadline: interaction.options.getString('deadline') || null,
        note: interaction.options.getString('note') || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (task.progress >= 100) task.status = 'done';
      db.tasks.push(task);
      writeDb(db);
      await refreshDashboard(client);
      return interaction.reply({ content: `Đã thêm task **#${task.id} - ${task.name}** ${progressBar(task.progress)}`, ephemeral: true });
    }

    if (sub === 'update') {
      const id = interaction.options.getString('id');
      const task = findTask(db, id);
      if (!task) return interaction.reply({ content: `Không tìm thấy task ID **${id}**.`, ephemeral: true });

      const progress = interaction.options.getInteger('progress');
      const status = interaction.options.getString('status');
      const assignee = interaction.options.getUser('assignee');
      const deadline = interaction.options.getString('deadline');
      const note = interaction.options.getString('note');

      if (progress !== null) task.progress = clampProgress(progress);
      if (status) task.status = status;
      if (assignee) task.assignee = `<@${assignee.id}>`;
      if (deadline !== null) task.deadline = deadline;
      if (note !== null) task.note = note;
      if (task.progress >= 100) task.status = 'done';
      task.updatedAt = new Date().toISOString();

      writeDb(db);
      await refreshDashboard(client);
      return interaction.reply({ content: `Đã cập nhật **#${task.id} - ${task.name}** ${progressBar(task.progress)} • ${statusLabel(task.status)}`, ephemeral: true });
    }

    if (sub === 'delete') {
      const id = interaction.options.getString('id');
      const index = db.tasks.findIndex(task => task.id === id);
      if (index === -1) return interaction.reply({ content: `Không tìm thấy task ID **${id}**.`, ephemeral: true });
      const [removed] = db.tasks.splice(index, 1);
      writeDb(db);
      await refreshDashboard(client);
      return interaction.reply({ content: `Đã xoá task **#${removed.id} - ${removed.name}**.`, ephemeral: true });
    }

    if (sub === 'list') {
      if (!db.tasks.length) return interaction.reply({ content: 'Chưa có task nào.', ephemeral: true });
      const text = db.tasks.map(task => `**#${task.id} ${task.name}**\n${progressBar(task.progress)} • ${statusLabel(task.status)}`).join('\n\n');
      return interaction.reply({ content: text.slice(0, 1900), ephemeral: true });
    }

    if (sub === 'dashboard') {
      await refreshDashboard(client);
      return interaction.reply({ content: 'Đã tạo/cập nhật dashboard tiến độ.', ephemeral: true });
    }
  },
};

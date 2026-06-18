const { EmbedBuilder } = require('discord.js');

function clampProgress(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function progressBar(percent) {
  const p = clampProgress(percent);
  const filled = Math.round(p / 10);
  const empty = 10 - filled;
  return `${'🟩'.repeat(filled)}${'⬜'.repeat(empty)} ${p}%`;
}

function statusIcon(status) {
  const map = {
    todo: '⏳',
    doing: '🔧',
    testing: '🧪',
    done: '✅',
    paused: '⏸️',
  };
  return map[status] || '📌';
}

function statusLabel(status) {
  const map = {
    todo: 'Chờ làm',
    doing: 'Đang làm',
    testing: 'Chờ test',
    done: 'Hoàn thành',
    paused: 'Tạm dừng',
  };
  return map[status] || status;
}

function buildDashboardEmbed(tasks) {
  const total = tasks.length
    ? Math.round(tasks.reduce((sum, task) => sum + clampProgress(task.progress), 0) / tasks.length)
    : 0;

  const lines = [];
  lines.push(`📈 **Tổng tiến độ:** ${progressBar(total)}`);
  lines.push('');

  if (!tasks.length) {
    lines.push('Chưa có task nào. Dùng `/task add` để tạo task đầu tiên.');
  } else {
    const sorted = [...tasks].sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });

    for (const task of sorted.slice(0, 20)) {
      const assignee = task.assignee ? ` • 👤 ${task.assignee}` : '';
      const deadline = task.deadline ? ` • 📅 ${task.deadline}` : '';
      lines.push(`${statusIcon(task.status)} **${task.name}**`);
      lines.push(`${progressBar(task.progress)} • ${statusLabel(task.status)}${assignee}${deadline}`);
      if (task.note) lines.push(`> ${task.note}`);
      lines.push('');
    }

    if (tasks.length > 20) {
      lines.push(`Và còn **${tasks.length - 20}** task khác...`);
    }
  }

  return new EmbedBuilder()
    .setTitle('📊 REAL ROLEPLAY DEVELOPMENT PROGRESS')
    .setDescription(lines.join('\n'))
    .setColor(0x2ecc71)
    .setFooter({ text: `Last Update: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}` });
}

module.exports = { progressBar, buildDashboardEmbed, clampProgress, statusLabel };

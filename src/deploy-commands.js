const { registerGuildCommands } = require('./commandRegistry');

registerGuildCommands().catch(error => {
  console.error('[Commands] Lỗi deploy slash commands:', error);
  process.exit(1);
});

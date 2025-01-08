const colors = require('colors');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log("[System]:".green, `Bot is online as ${client.user.tag}`);
        console.log("[System]:".cyan, `Watching ${client.guilds.cache.size} servers`);
        console.log("[System]:".yellow, `Serving ${client.users.cache.size} users`);
    }
};

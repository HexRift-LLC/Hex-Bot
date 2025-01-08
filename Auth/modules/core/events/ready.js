module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log("[System]:".green, `Logged in as ${client.user.tag}!`);
    }
};

const play = require('./commands/play');
const stop = require('./commands/stop');

module.exports = {
    init(client, commands) {
        commands.set('play', play);
        commands.set('stop', stop);
    }
};
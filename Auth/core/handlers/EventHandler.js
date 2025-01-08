const fs = require('fs');
const path = require('path');
const colors = require('colors');

class EventHandler {
    constructor(client) {
        this.client = client;
    }

    loadEvents() {
        const eventsPath = path.join(process.cwd(), 'events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(path.join(eventsPath, file));
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(...args, this.client));
            } else {
                this.client.on(event.name, (...args) => event.execute(...args, this.client));
            }
            console.log("[System]:".green, `Loaded event: ${event.name}`);
        }
    }
}

module.exports = EventHandler;

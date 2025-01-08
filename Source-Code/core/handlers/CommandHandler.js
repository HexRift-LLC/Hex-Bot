const { Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

class CommandHandler {
    constructor(client) {
        this.client = client;
        this.commands = new Collection();
    }

    loadCommands() {
        const commandsPath = path.join(process.cwd(), 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            this.commands.set(command.data.name, command);
            console.log("[System]:".green, `Loaded command: ${command.data.name}`);
        }
    }

    getCommands() {
        return this.commands;
    }
}

module.exports = CommandHandler;

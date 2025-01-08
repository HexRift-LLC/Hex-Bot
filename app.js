const { Client, Collection, GatewayIntentBits, REST, Routes  } = require('discord.js');
const CommandHandler = require('./core/handlers/CommandHandler');
const EventHandler = require('./core/handlers/EventHandler');
const AddonHandler = require('./core/handlers/AddonHandler');
const ConfigManager = require('./core/utils/ConfigManager');
const colors = require('colors');

class HexBot {
    constructor() {
        this.config = new ConfigManager();
        
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });

        // Initialize commands collection
        this.client.commands = new Collection();

        this.commandHandler = new CommandHandler(this.client);
        this.eventHandler = new EventHandler(this.client);
        this.addonHandler = new AddonHandler(this.client);
    }

    async registerCommands() {
        const commands = [];
        this.client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const rest = new REST({ version: '10' }).setToken(this.config.get('Bot.token'));
        
        console.log("[System]:".yellow, "Started refreshing application (/) commands.");
        
        try {
            await rest.put(
                Routes.applicationCommands(this.config.get('Bot.clientId')),
                { body: commands },
            );
            
            console.log("[System]:".green, "Successfully registered application commands.");
        } catch (error) {
            console.log("[System]:".red, "Error registering commands:", error);
        }
    }

    async start() {
        console.log("[System]:".cyan, "Starting Hex Bot...");
        
        // Initialize handlers
        this.commandHandler.loadCommands();
        this.eventHandler.loadEvents();
        this.addonHandler.loadAddons();

        // Register commands
        await this.registerCommands();

        // Login
        await this.client.login(this.config.get('Bot.token'));
    }
}
const bot = new HexBot();
bot.start().catch(error => {
    console.log("[System]:".red, "Failed to start bot:", error);
});
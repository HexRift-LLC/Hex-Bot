const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const ModuleHandler = require('./core/handlers/ModuleHandler');
const ConfigManager = require('./core/utils/ConfigManager');
const colors = require('colors');
const { Auth } = require("./Auth");

class HexBot {
    constructor() {
        this.config = new ConfigManager();
        
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates
            ]
        });

        this.client.commands = new Collection();
        this.moduleHandler = new ModuleHandler(this.client);
    }

    async authenticate(retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                await Auth();
                console.log("[AUTH]".green, "Hex Bot: Authentication successful!");
                return true;
            } catch (error) {
                console.log("[AUTH]".yellow, `Attempt ${i + 1}/${retries} failed:`, error.message);
                if (i === retries - 1) {
                    console.log("[AUTH]".brightRed, "Authentication failed after all attempts");
                    process.exit(1);
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
        return false;
    }

    async registerCommands() {
        const commands = [];
        this.client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const rest = new REST({ version: '10' }).setToken(this.config.get('Bot.token'));
        
        try {
            console.log("[System]:".yellow, "Started refreshing application (/) commands.");
            
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
    const authenticated = await this.authenticate();
      if (authenticated) {
        console.log("[System]:".cyan, "Starting Hex Bot...");
        
        this.moduleHandler.loadModules();
        await this.registerCommands();
        await this.client.login(this.config.get('Bot.token'));
    }
}
}
const bot = new HexBot();
bot.start().catch(async error => {
    await authenticated();
    console.log("[System]:".red, "Failed to start bot:", error);
});
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../utils/config');

class Bot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });
        
        this.commands = [
            new SlashCommandBuilder()
                .setName('ping')
                .setDescription('Check bot latency and status'),
            
            new SlashCommandBuilder()
                .setName('stats')
                .setDescription('View detailed bot statistics'),
            
            new SlashCommandBuilder()
                .setName('info')
                .setDescription('Get information about the bot'),

            new SlashCommandBuilder()
                .setName('server')
                .setDescription('Display server information')
        ];

        this.client.on('ready', () => {
            this.registerCommands();
            console.log(`Logged in as ${this.client.user.tag}`);
        });

        this.client.on('interactionCreate', this.handleInteraction.bind(this));
    }

    async registerCommands() {
        const rest = new REST({ version: '10' }).setToken(config.get('bot.token'));
        
        try {
            await rest.put(
                Routes.applicationCommands(this.client.user.id),
                { body: this.commands }
            );
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    }

    async handleInteraction(interaction) {
        if (!interaction.isCommand()) return;

        switch (interaction.commandName) {
            case 'ping':
                const pingEmbed = new EmbedBuilder()
                    .setColor('#ff3366')
                    .setTitle('🏓 Pong!')
                    .setThumbnail(this.client.user.displayAvatarURL())
                    .addFields(
                        { name: 'Latency', value: `${this.client.ws.ping}ms`, inline: true },
                        { name: 'API Status', value: '✅ Operational', inline: true }
                    )
                    .setFooter({ text: 'Bot Status Monitor' })
                    .setImage('https://hexmodz.com/Hex-Modz1.png')
                    .setTimestamp();
                await interaction.reply({ embeds: [pingEmbed] });
                break;
                
            case 'stats':
                const statsEmbed = new EmbedBuilder()
                    .setColor('#ff3366')
                    .setTitle('📊 Bot Statistics')
                    .setThumbnail(this.client.user.displayAvatarURL())
                    .addFields(
                        { name: '🌐 Servers', value: `${this.client.guilds.cache.size}`, inline: true },
                        { name: '👥 Users', value: `${this.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`, inline: true },
                        { name: '⏱️ Uptime', value: this.formatUptime(this.client.uptime), inline: true },
                        { name: '🔧 Version', value: 'v1.0.0', inline: true },
                        { name: '📡 Ping', value: `${this.client.ws.ping}ms`, inline: true }
                    )
                    .setImage('https://hexmodz.com/Hex-Modz1.png')
                    .setFooter({ text: 'Advanced Statistics' })
                    .setTimestamp();
                await interaction.reply({ embeds: [statsEmbed] });
                break;

            case 'info':
                const infoEmbed = new EmbedBuilder()
                    .setColor('#ff3366')
                    .setTitle('Bot Information')
                    .setThumbnail(this.client.user.displayAvatarURL())
                    .setDescription('A powerful Discord bot built with modern features')
                    .setThumbnail(this.client.user.displayAvatarURL())
                    .addFields(
                        { name: '🛠️ Developer', value: 'Your Name', inline: true },
                        { name: '📚 Library', value: 'discord.js', inline: true },
                        { name: '🔗 Website', value: '[Visit Dashboard](your-dashboard-url)', inline: true }
                    )
                    .setImage('https://hexmodz.com/Hex-Modz1.png')
                    .setFooter({ text: 'Type /help for commands' });
                await interaction.reply({ embeds: [infoEmbed] });
                break;

            case 'server':
                const server = interaction.guild;
                const serverEmbed = new EmbedBuilder()
                    .setColor('#ff3366')
                    .setTitle(`${server.name} Information`)
                    .setThumbnail(server.iconURL())
                    .addFields(
                        { name: '👑 Owner', value: `<@${server.ownerId}>`, inline: true },
                        { name: '👥 Members', value: `${server.memberCount}`, inline: true },
                        { name: '🔧 Roles', value: `${server.roles.cache.size}`, inline: true },
                        { name: '📺 Channels', value: `${server.channels.cache.size}`, inline: true },
                        { name: '🚀 Boost Level', value: `Level ${server.premiumTier}`, inline: true },
                        { name: '📅 Created', value: `<t:${Math.floor(server.createdTimestamp / 1000)}:R>`, inline: true }
                    )
                    .setFooter({ text: `Server ID: ${server.id}` })
                    .setImage('https://hexmodz.com/Hex-Modz1.png')
                    .setTimestamp();
                await interaction.reply({ embeds: [serverEmbed] });
                break;
        }
    }

    formatUptime(uptime) {
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor(uptime / 3600000) % 24;
        const minutes = Math.floor(uptime / 60000) % 60;
        return `${days}d ${hours}h ${minutes}m`;
    }

    async start() {
        try {
            await this.client.login(config.get('bot.token'));
            this.status = 'online';
            return Promise.resolve();
        } catch (error) {
            console.error('Bot login failed:', error);
            this.status = 'error';
            return Promise.reject(error);
        }
    }

    async stop() {
        await this.client.destroy();
        this.status = 'offline';
        return Promise.resolve();
    }

    async restart() {
        await this.stop();
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.start();
    }

    get guilds() {
        return this.client.guilds;
    }

    updateMemberCounts() {
        this.totalUsers = this.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    }

    get users() {
        return this.totalUsers || 0;
    }
}module.exports = Bot;
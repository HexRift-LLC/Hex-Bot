const { EmbedBuilder } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));
const ping = require('./commands/ping');
const help = require('./commands/help');
const interactionCreate = require('./events/interactionCreate');

module.exports = {
    init(client, commands) {
        // Register commands
        commands.set('ping', ping);
        commands.set('help', help);

        // Register events
        client.on(interactionCreate.name, (...args) => interactionCreate.execute(...args, client));
        
        // Handle button interactions
        client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;

            if (interaction.customId === 'refresh_ping') {
                await ping.execute(interaction);
            }

            if (interaction.customId === 'detailed_stats') {
                const os = require('os');
                const statsEmbed = new EmbedBuilder()
                    .setTitle('📊 Detailed Statistics')
                    .setColor(config.Embed.embedColor)
                    .setThumbnail(config.Embed.footerIcon)
                    .addFields([
                        { name: '💻 CPU', value: `\`\`\`prolog\nModel: ${os.cpus()[0].model}\nCores: ${os.cpus().length}\nUsage: ${(process.cpuUsage().user / 1024 / 1024).toFixed(2)}%\`\`\``, inline: false },
                        { name: '💾 Memory', value: `\`\`\`prolog\nTotal: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB\nFree: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB\nUsage: ${((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)}%\`\`\``, inline: false },
                        { name: '⚙️ System', value: `\`\`\`prolog\nPlatform: ${os.platform()}\nArch: ${os.arch()}\nUptime: ${(os.uptime() / 3600).toFixed(2)} hours\`\`\``, inline: false }
                    ])
                    .setTimestamp()
                    .setFooter({ 
                        text: `${config.Embed.footerText} • Version ${config.System.version}`, 
                        iconURL: config.Embed.footerIcon 
                    });

                await interaction.reply({ embeds: [statsEmbed], ephemeral: true });
            }
        });
    }
};
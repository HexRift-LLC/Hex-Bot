const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows detailed bot status and latency information'),
    execute: async (interaction) => {
        const sent = await interaction.deferReply({ fetchReply: true });
        
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);

        const pingEmbed = new EmbedBuilder()
            .setTitle('🤖 Bot Status')
            .setDescription(`Detailed performance metrics for ${interaction.client.user.username}`)
            .setThumbnail(config.Embed.footerIcon)
            .addFields([
                {
                    name: '📊 Latency',
                    value: `\`\`\`prolog\nBot Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms\nAPI Latency: ${interaction.client.ws.ping}ms\`\`\``,
                    inline: false
                },
                {
                    name: '⏰ Uptime',
                    value: `\`\`\`prolog\n${days}d ${hours}h ${minutes}m ${seconds}s\`\`\``,
                    inline: true
                },
                {
                    name: '💾 Memory',
                    value: `\`\`\`prolog\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\`\``,
                    inline: true
                },
                {
                    name: '🔧 System',
                    value: `\`\`\`prolog\nPlatform: ${os.platform()}\nNode: ${process.version}\`\`\``,
                    inline: false
                }
            ])
            .setColor(config.Embed.embedColor)
            .setTimestamp()
            .setFooter({ 
                text: `${config.Embed.footerText} • Version ${config.System.version}`, 
                iconURL: config.Embed.footerIcon 
            });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('refresh_ping')
                    .setLabel('🔄 Refresh')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('detailed_stats')
                    .setLabel('📊 Detailed Stats')
                    .setStyle(ButtonStyle.Secondary)
            );

        return interaction.editReply({
            embeds: [pingEmbed],
            components: [row]
        });
    }
};
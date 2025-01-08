const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the bot latency and API response time'),
    execute: async (interaction) => {
        const sent = await interaction.deferReply({ fetchReply: true });
        const pingEmbed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Latency', value: `\`${sent.createdTimestamp - interaction.createdTimestamp}ms\``, inline: true },
                { name: 'API Latency', value: `\`${interaction.client.ws.ping}ms\``, inline: true }
            )
            .setColor(config.Embed.embedColor)
            .setTimestamp()
            .setFooter({ 
                text: config.Embed.footerText, 
                iconURL: config.Embed.footerIcon || undefined 
            });
        
        return interaction.editReply({ embeds: [pingEmbed] });
    },
};
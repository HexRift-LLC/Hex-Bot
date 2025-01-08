const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current song and clear queue'),
    execute: async (interaction) => {
        await interaction.reply('⏹️ Stopped the music! (Music functionality coming soon)');
    }
};
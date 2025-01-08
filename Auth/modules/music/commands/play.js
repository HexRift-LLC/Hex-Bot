const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube or URL')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song name or URL')
                .setRequired(true)),
    execute: async (interaction) => {
        await interaction.reply('🎵 Music system loaded! Playing your song... (Music functionality coming soon)');
    }
};
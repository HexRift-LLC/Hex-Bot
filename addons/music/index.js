const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    init(client, commands) {
        const playCommand = {
            data: new SlashCommandBuilder()
                .setName('play')
                .setDescription('Play music')
                .addStringOption(option =>
                    option.setName('song')
                        .setDescription('Song name or URL')
                        .setRequired(true)),
            execute: async (interaction) => {
                await interaction.reply('Music system loaded!');
            }
        };

        commands.set('play', playCommand);
    }
};
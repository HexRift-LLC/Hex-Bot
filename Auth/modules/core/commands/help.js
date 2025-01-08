const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),
    execute: async (interaction) => {
        const modules = [];
        const modulePath = path.join(process.cwd(), 'modules');
        const moduleFolders = fs.readdirSync(modulePath);

        for (const folder of moduleFolders) {
            try {
                const moduleConfig = require(path.join(modulePath, folder, 'module.json'));
                if (moduleConfig.enabled) {
                    modules.push({
                        name: moduleConfig.name,
                        description: moduleConfig.description,
                        commands: moduleConfig.commands
                    });
                }
            } catch (error) {
                console.log("[System]:".red, `Failed to load help for module ${folder}`);
            }
        }

        const mainEmbed = new EmbedBuilder()
            .setTitle('📚 Command Center')
            .setDescription('Welcome to the help center! Select a category from the dropdown menu below to view commands.')
            .setColor(config.Embed.embedColor)
            .setThumbnail(config.Embed.footerIcon)
            .addFields([
                {
                    name: '📊 Statistics',
                    value: `\`\`\`prolog\nModules: ${modules.length}\nCommands: ${modules.reduce((acc, m) => acc + m.commands.length, 0)}\`\`\``,
                    inline: true
                },
                {
                    name: '🔧 Prefix',
                    value: '\n/\n',
                    inline: true
                }
            ])
            .setTimestamp()
            .setFooter({ 
                text: `${config.Embed.footerText} • Version ${config.System.version}`,
                iconURL: config.Embed.footerIcon 
            });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category')
            .setPlaceholder('📚 Select a category')
            .addOptions(
                modules.map(module => ({
                    label: module.name,
                    description: module.description,
                    value: module.name.toLowerCase(),
                    emoji: module.name === 'Core' ? '⚙️' : '📦'
                }))
            );

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        const response = await interaction.reply({
            embeds: [mainEmbed],
            components: [row],
            ephemeral: true
        });

        const collector = response.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'help_category') {
                const selectedModule = modules.find(m => m.name.toLowerCase() === i.values[0]);
                
                const categoryEmbed = new EmbedBuilder()
                    .setTitle(`${selectedModule.name === 'Core' ? '⚙️' : '📦'} ${selectedModule.name} Commands`)
                    .setDescription(selectedModule.description)
                    .setThumbnail(config.Embed.footerIcon)
                    .setColor(config.Embed.embedColor)
                    .addFields(
                        selectedModule.commands.map(cmd => ({
                            name: `/${cmd.name}`,
                            value: cmd.description,
                            inline: true
                        }))
                    )
                    .setTimestamp()
                    .setFooter({ 
                        text: 'Use the dropdown to view other categories',
                        iconURL: config.Embed.footerIcon 
                    });

                await i.update({ embeds: [categoryEmbed], components: [row] });
            }
        });

        collector.on('end', () => {
            mainEmbed.setFooter({ text: 'This help menu has expired. Use /help again.' });
            interaction.editReply({ embeds: [mainEmbed], components: [] });
        });
    }
};
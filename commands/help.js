const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),
    execute: async (interaction) => {
        const helpEmbed = new EmbedBuilder()
            .setTitle('📚 Command List')
            .setColor(config.Embed.embedColor)
            .setTimestamp()
            .setFooter({ text: config.Embed.footerText });

        // Core Commands
        const coreCommands = [];
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./${file}`);
            coreCommands.push(`\`/${command.data.name}\` - ${command.data.description}`);
        }
        
        helpEmbed.addFields({ 
            name: '🤖 Core Commands', 
            value: coreCommands.join('\n') || 'No commands available' 
        });

        // Addon Commands
        const addonPath = path.join(process.cwd(), 'addons');
        if (fs.existsSync(addonPath)) {
            const addonFolders = fs.readdirSync(addonPath).filter(file => !file.startsWith('core'));
            
            for (const folder of addonFolders) {
                try {
                    const addonConfig = require(path.join(addonPath, folder, 'addon.json'));
                    if (addonConfig.enabled && addonConfig.commands) {
                        const addonCommands = addonConfig.commands.map(cmd => 
                            `\`/${cmd.name}\` - ${cmd.description}`
                        );
                        
                        helpEmbed.addFields({ 
                            name: `📦 ${addonConfig.name} Commands`, 
                            value: addonCommands.join('\n') 
                        });
                    }
                } catch (error) {
                    console.log("[System]:".red, `Failed to load help for addon ${folder}`);
                }
            }
        }

        await interaction.reply({ embeds: [helpEmbed] });
    },
};
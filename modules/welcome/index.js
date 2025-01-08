const { EmbedBuilder } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));
const welcomeConfig = require('./commands/welcome-config');

module.exports = {
    init(client, commands) {
        // Register commands
        commands.set('welcome-config', welcomeConfig);

        // Register welcome event
        client.on('guildMemberAdd', member => {
            const welcomeChannel = member.guild.systemChannel;
            if (welcomeChannel) {
                const welcomeEmbed = new EmbedBuilder()
                    .setTitle('👋 Welcome!')
                    .setDescription(`Welcome ${member.user.tag} to the server! 🎉`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setColor(config.Embed.embedColor)
                    .setTimestamp()
                    .setFooter({ text: config.Embed.footerText });

                welcomeChannel.send({ embeds: [welcomeEmbed] });
            }
        });
    }
};
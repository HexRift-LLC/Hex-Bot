const { EmbedBuilder } = require('discord.js');

module.exports = {
    init(client) {
        client.on('guildMemberAdd', member => {
            const welcomeChannel = member.guild.systemChannel;
            if (welcomeChannel) {
                const welcomeEmbed = new EmbedBuilder()
                    .setTitle('Welcome!')
                    .setDescription(`Welcome ${member.user.tag} to the server! 🎉`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setColor('#00ff00')
                    .setTimestamp();
                
                welcomeChannel.send({ embeds: [welcomeEmbed] });
            }
        });
    }
};

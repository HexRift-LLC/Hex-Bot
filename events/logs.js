const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));

module.exports = {
    name: 'ready',
    execute(client) {
        if (!config.Logs.enabled) return;

        // Message Events
        client.on('messageDelete', async message => {
            if (!config.Logs.messageDelete || !message.guild) return;
            const logChannel = message.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('Message Deleted')
                .setColor(config.Theme.embedColor)
                .addFields(
                    { name: 'Author', value: `${message.author.tag}`, inline: true },
                    { name: 'Channel', value: `${message.channel}`, inline: true },
                    { name: 'Content', value: message.content || 'No content' }
                )
                .setTimestamp()
                .setFooter({ text: config.Theme.footerText });

            logChannel.send({ embeds: [embed] });
        });

        client.on('messageUpdate', async (oldMessage, newMessage) => {
            if (!config.Logs.messageUpdate || !oldMessage.guild) return;
            const logChannel = oldMessage.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel || oldMessage.content === newMessage.content) return;

            const embed = new EmbedBuilder()
                .setTitle('Message Edited')
                .setColor(config.Theme.embedColor)
                .addFields(
                    { name: 'Author', value: `${oldMessage.author.tag}`, inline: true },
                    { name: 'Channel', value: `${oldMessage.channel}`, inline: true },
                    { name: 'Old Content', value: oldMessage.content || 'No content' },
                    { name: 'New Content', value: newMessage.content || 'No content' }
                )
                .setTimestamp()
                .setFooter({ text: config.Theme.footerText });

            logChannel.send({ embeds: [embed] });
        });

        // Member Events
        client.on('guildMemberAdd', member => {
            if (!config.Logs.memberJoin) return;
            const logChannel = member.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('Member Joined')
                .setColor(config.Theme.embedColor)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'User', value: `${member.user.tag}`, inline: true },
                    { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: config.Theme.footerText });

            logChannel.send({ embeds: [embed] });
        });

        client.on('guildMemberRemove', member => {
            if (!config.Logs.memberLeave) return;
            const logChannel = member.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('Member Left')
                .setColor(config.Theme.embedColor)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'User', value: `${member.user.tag}`, inline: true },
                    { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: config.Theme.footerText });

            logChannel.send({ embeds: [embed] });
        });

        client.on('guildMemberUpdate', async (oldMember, newMember) => {
            if (!config.Logs.memberUpdate) return;
            const logChannel = oldMember.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            const changes = [];
            if (oldMember.nickname !== newMember.nickname) {
                changes.push(`Nickname: ${oldMember.nickname || 'None'} → ${newMember.nickname || 'None'}`);
            }
            if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
                const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
                const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
                if (addedRoles.size) changes.push(`Added Roles: ${addedRoles.map(r => r.name).join(', ')}`);
                if (removedRoles.size) changes.push(`Removed Roles: ${removedRoles.map(r => r.name).join(', ')}`);
            }

            if (changes.length > 0) {
                const embed = new EmbedBuilder()
                    .setTitle('Member Updated')
                    .setColor(config.Theme.embedColor)
                    .setThumbnail(newMember.user.displayAvatarURL())
                    .addFields(
                        { name: 'User', value: `${newMember.user.tag}`, inline: true },
                        { name: 'Changes', value: changes.join('\n') }
                    )
                    .setTimestamp()
                    .setFooter({ text: config.Theme.footerText });

                logChannel.send({ embeds: [embed] });
            }
        });

        // Channel Events
        client.on('channelCreate', async channel => {
            if (!config.Logs.channelCreate || !channel.guild) return;
            const logChannel = channel.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('Channel Created')
                .setColor(config.Theme.embedColor)
                .addFields(
                    { name: 'Name', value: `${channel.name}`, inline: true },
                    { name: 'Type', value: `${channel.type}`, inline: true },
                    { name: 'Category', value: channel.parent ? channel.parent.name : 'None', inline: true }
                )
                .setTimestamp()
                .setFooter({ text: config.Theme.footerText });

            logChannel.send({ embeds: [embed] });
        });

        client.on('channelDelete', async channel => {
            if (!config.Logs.channelDelete || !channel.guild) return;
            const logChannel = channel.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('Channel Deleted')
                .setColor(config.Theme.embedColor)
                .addFields(
                    { name: 'Name', value: `${channel.name}`, inline: true },
                    { name: 'Type', value: `${channel.type}`, inline: true },
                    { name: 'Category', value: channel.parent ? channel.parent.name : 'None', inline: true }
                )
                .setTimestamp()
                .setFooter({ text: config.Theme.footerText });

            logChannel.send({ embeds: [embed] });
        });

        // Role Events
        client.on('roleCreate', async role => {
            if (!config.Logs.roleCreate) return;
            const logChannel = role.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('Role Created')
                .setColor(config.Theme.embedColor)
                .addFields(
                    { name: 'Name', value: role.name, inline: true },
                    { name: 'Color', value: role.hexColor, inline: true },
                    { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true }
                )
                .setTimestamp()
                .setFooter({ text: config.Theme.footerText });

            logChannel.send({ embeds: [embed] });
        });

        client.on('roleDelete', async role => {
            if (!config.Logs.roleDelete) return;
            const logChannel = role.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('Role Deleted')
                .setColor(config.Theme.embedColor)
                .addFields(
                    { name: 'Name', value: role.name, inline: true },
                    { name: 'Color', value: role.hexColor, inline: true },
                    { name: 'Member Count', value: `${role.members.size}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: config.Theme.footerText });

            logChannel.send({ embeds: [embed] });
        });

        // Voice Events
        client.on('voiceStateUpdate', (oldState, newState) => {
            if (!config.Logs.voiceStateUpdate) return;
            const logChannel = oldState.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            let description = '';
            if (!oldState.channel && newState.channel) {
                description = `${newState.member.user.tag} joined ${newState.channel.name}`;
            } else if (oldState.channel && !newState.channel) {
                description = `${oldState.member.user.tag} left ${oldState.channel.name}`;
            } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
                description = `${oldState.member.user.tag} moved from ${oldState.channel.name} to ${newState.channel.name}`;
            }

            if (description) {
                const embed = new EmbedBuilder()
                    .setTitle('Voice State Update')
                    .setColor(config.Theme.embedColor)
                    .setDescription(description)
                    .setTimestamp()
                    .setFooter({ text: config.Theme.footerText });

                logChannel.send({ embeds: [embed] });
            }
        });

        // Ban Events
        client.on('guildBanAdd', async ban => {
            if (!config.Logs.banAdd) return;
            const logChannel = ban.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('Member Banned')
                .setColor(config.Theme.embedColor)
                .setThumbnail(ban.user.displayAvatarURL())
                .addFields(
                    { name: 'User', value: ban.user.tag, inline: true },
                    { name: 'Reason', value: ban.reason || 'No reason provided' }
                )
                .setTimestamp()
                .setFooter({ text: config.Theme.footerText });

            logChannel.send({ embeds: [embed] });
        });

        client.on('guildBanRemove', async ban => {
            if (!config.Logs.banRemove) return;
            const logChannel = ban.guild.channels.cache.get(config.Logs.channelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle('Member Unbanned')
                .setColor(config.Theme.embedColor)
                .setThumbnail(ban.user.displayAvatarURL())
                .addFields(
                    { name: 'User', value: ban.user.tag, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: config.Theme.footerText });

            logChannel.send({ embeds: [embed] });
        });
    }
};
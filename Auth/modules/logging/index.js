const { EmbedBuilder } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));
const loggingCommand = require('./commands/logging');

module.exports = {
    init(client, commands) {
        commands.set('logging', loggingCommand);

        if (!config.Logs.enabled) return;

        // Message Events
        client.on('messageDelete', message => {
            if (!config.Logs.messageDelete || !message.guild) return;
            this.logEvent(message.guild, {
                emoji: '📝',
                title: 'Message Deleted',
                description: `A message was deleted in ${message.channel}`,
                color: '#ff0000',
                fields: [
                    { name: '👤 Author', value: `${message.author.tag} (${message.author.id})`, inline: true },
                    { name: '📅 Created', value: `<t:${Math.floor(message.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: '📄 Content', value: `\`\`\`${message.content || 'No content'}\`\`\`` }
                ],
                thumbnail: message.author.displayAvatarURL(),
                author: {
                    name: 'Message Logs',
                    iconURL: message.guild.iconURL()
                },
                id: message.id
            });
        });

        client.on('messageUpdate', (oldMessage, newMessage) => {
            if (!config.Logs.messageUpdate || !oldMessage.guild) return;
            if (oldMessage.content === newMessage.content) return;
            
            this.logEvent(oldMessage.guild, {
                emoji: '✏️',
                title: 'Message Edited',
                description: `A message was edited in ${oldMessage.channel}`,
                color: '#ffa500',
                fields: [
                    { name: '👤 Author', value: `${oldMessage.author.tag} (${oldMessage.author.id})`, inline: true },
                    { name: '📅 Edited', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
                    { name: '📄 Old Content', value: `\`\`\`${oldMessage.content || 'No content'}\`\`\`` },
                    { name: '📝 New Content', value: `\`\`\`${newMessage.content || 'No content'}\`\`\`` }
                ],
                thumbnail: oldMessage.author.displayAvatarURL(),
                author: {
                    name: 'Message Logs',
                    iconURL: oldMessage.guild.iconURL()
                },
                id: oldMessage.id
            });
        });

        // Member Events
        client.on('guildMemberAdd', member => {
            if (!config.Logs.memberJoin) return;
            this.logEvent(member.guild, {
                emoji: '👋',
                title: 'Member Joined',
                description: `${member.user.tag} joined the server`,
                color: '#00ff00',
                fields: [
                    { name: '👤 User', value: `${member.user.tag} (${member.user.id})`, inline: true },
                    { name: '📅 Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: '👥 Member Count', value: `\`${member.guild.memberCount}\` members`, inline: true }
                ],
                thumbnail: member.user.displayAvatarURL(),
                author: {
                    name: 'Member Logs',
                    iconURL: member.guild.iconURL()
                },
                id: member.user.id
            });
        });

        client.on('guildMemberRemove', member => {
            if (!config.Logs.memberLeave) return;
            this.logEvent(member.guild, {
                emoji: '👋',
                title: 'Member Left',
                description: `${member.user.tag} left the server`,
                color: '#ff0000',
                fields: [
                    { name: '👤 User', value: `${member.user.tag} (${member.user.id})`, inline: true },
                    { name: '📅 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                    { name: '👥 Member Count', value: `\`${member.guild.memberCount}\` members`, inline: true },
                    { name: '🎭 Roles', value: member.roles.cache.size > 1 ? 
                        member.roles.cache.filter(r => r.id !== member.guild.id).map(r => `\`${r.name}\``).join(', ') : 
                        'No roles' }
                ],
                thumbnail: member.user.displayAvatarURL(),
                author: {
                    name: 'Member Logs',
                    iconURL: member.guild.iconURL()
                },
                id: member.user.id
            });
        });

        // Channel Events
        client.on('channelCreate', channel => {
            if (!config.Logs.channelCreate || !channel.guild) return;
            this.logEvent(channel.guild, {
                emoji: '📊',
                title: 'Channel Created',
                description: `A new channel was created: ${channel}`,
                color: '#00ff00',
                fields: [
                    { name: '📝 Name', value: `\`${channel.name}\``, inline: true },
                    { name: '📁 Type', value: `\`${channel.type}\``, inline: true },
                    { name: '📂 Category', value: channel.parent ? `\`${channel.parent.name}\`` : '`None`', inline: true }
                ],
                author: {
                    name: 'Channel Logs',
                    iconURL: channel.guild.iconURL()
                },
                id: channel.id
            });
        });

        // Role Events
        client.on('roleCreate', role => {
            if (!config.Logs.roleCreate) return;
            this.logEvent(role.guild, {
                emoji: '🎭',
                title: 'Role Created',
                description: `A new role was created: ${role}`,
                color: role.color || '#00ff00',
                fields: [
                    { name: '📝 Name', value: `\`${role.name}\``, inline: true },
                    { name: '🎨 Color', value: `\`${role.hexColor}\``, inline: true },
                    { name: '🔍 Mentionable', value: role.mentionable ? '`Yes`' : '`No`', inline: true },
                    { name: '📊 Position', value: `\`${role.position}\``, inline: true }
                ],
                author: {
                    name: 'Role Logs',
                    iconURL: role.guild.iconURL()
                },
                id: role.id
            });
        });

        // Ban Events
        client.on('guildBanAdd', ban => {
            if (!config.Logs.banAdd) return;
            this.logEvent(ban.guild, {
                emoji: '🔨',
                title: 'Member Banned',
                description: `${ban.user.tag} was banned from the server`,
                color: '#ff0000',
                fields: [
                    { name: '👤 User', value: `${ban.user.tag} (${ban.user.id})`, inline: true },
                    { name: '📅 Account Created', value: `<t:${Math.floor(ban.user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: '📝 Reason', value: ban.reason ? `\`\`\`${ban.reason}\`\`\`` : '`No reason provided`' }
                ],
                thumbnail: ban.user.displayAvatarURL(),
                author: {
                    name: 'Ban Logs',
                    iconURL: ban.guild.iconURL()
                },
                id: ban.user.id
            });
        });
    },

    logEvent(guild, eventData) {
        const logChannel = guild.channels.cache.get(config.Logs.channelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle(`${eventData.emoji} ${eventData.title}`)
            .setDescription(eventData.description || null)
            .setColor(eventData.color || config.Embed.embedColor)
            .addFields(eventData.fields)
            .setTimestamp();

        if (eventData.thumbnail) {
            embed.setThumbnail(eventData.thumbnail);
        }

        if (eventData.author) {
            embed.setAuthor({
                name: eventData.author.name,
                iconURL: eventData.author.iconURL
            });
        }

        if (eventData.image) {
            embed.setImage(eventData.image);
        }

        embed.setFooter({ 
            text: `ID: ${eventData.id || 'N/A'} • ${config.Embed.footerText}`,
            iconURL: config.Embed.footerIcon || null
        });

        logChannel.send({ embeds: [embed] });
    }
};
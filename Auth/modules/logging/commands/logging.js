const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logging')
        .setDescription('Configure server logging settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View current logging settings'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Set the logging channel')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send logs to')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('toggle')
                .setDescription('Toggle specific logging events')
                .addStringOption(option =>
                    option.setName('event')
                        .setDescription('The event to toggle')
                        .setRequired(true)
                        .addChoices(
                            { name: '📝 Message Delete', value: 'messageDelete' },
                            { name: '✏️ Message Edit', value: 'messageUpdate' },
                            { name: '👋 Member Join', value: 'memberJoin' },
                            { name: '👋 Member Leave', value: 'memberLeave' },
                            { name: '📊 Channel Events', value: 'channelEvents' },
                            { name: '🎭 Role Events', value: 'roleEvents' },
                            { name: '🔨 Ban Events', value: 'banEvents' }
                        ))),

    execute: async (interaction) => {
        const getActiveEvents = () => {
            const events = [];
            if (config.Logs.messageDelete) events.push('📝 Message Delete');
            if (config.Logs.messageUpdate) events.push('✏️ Message Edit');
            if (config.Logs.memberJoin) events.push('👋 Member Join');
            if (config.Logs.memberLeave) events.push('👋 Member Leave');
            if (config.Logs.channelCreate || config.Logs.channelDelete) events.push('📊 Channel Events');
            if (config.Logs.roleCreate || config.Logs.roleDelete) events.push('🎭 Role Events');
            if (config.Logs.banAdd || config.Logs.banRemove) events.push('🔨 Ban Events');

            return events.length ? events.join('\n') : '❌ No events enabled';
        };

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'view': {
                const embed = new EmbedBuilder()
                    .setTitle('🛠️ Logging Configuration')
                    .setDescription('Current logging settings for this server')
                    .setColor(config.Embed.embedColor)
                    .addFields([
                        {
                            name: '📊 Status',
                            value: config.Logs.enabled ? '`✅ ENABLED`' : '`❌ DISABLED`',
                            inline: true
                        },
                        {
                            name: '📝 Log Channel',
                            value: config.Logs.channelId ? `<#${config.Logs.channelId}>` : '`Not Set`',
                            inline: true
                        },
                        {
                            name: '\u200B',
                            value: '\u200B',
                            inline: true
                        },
                        {
                            name: '📋 Active Events',
                            value: `\`\`\`${getActiveEvents()}\`\`\``,
                        }
                    ])
                    .setTimestamp()
                    .setFooter({ 
                        text: `Requested by ${interaction.user.tag}`, 
                        iconURL: interaction.user.displayAvatarURL() 
                    });

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }

            case 'channel': {
                const channel = interaction.options.getChannel('channel');
                const oldChannel = config.Logs.channelId ? `<#${config.Logs.channelId}>` : '`None`';
                config.Logs.channelId = channel.id;
                fs.writeFileSync('config.yml', yaml.dump(config));

                const embed = new EmbedBuilder()
                    .setTitle('📝 Logging Channel Updated')
                    .setColor(config.Embed.embedColor)
                    .addFields([
                        {
                            name: 'Old Channel',
                            value: oldChannel,
                            inline: true
                        },
                        {
                            name: 'New Channel',
                            value: `${channel}`,
                            inline: true
                        }
                    ])
                    .setTimestamp()
                    .setFooter({ 
                        text: `Updated by ${interaction.user.tag}`, 
                        iconURL: interaction.user.displayAvatarURL() 
                    });

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }

            case 'toggle': {
                const event = interaction.options.getString('event');
                const oldStatus = config.Logs[event];
                config.Logs[event] = !config.Logs[event];
                fs.writeFileSync('config.yml', yaml.dump(config));

                const embed = new EmbedBuilder()
                    .setTitle('🔄 Event Toggle Updated')
                    .setDescription(`Event: \`${event}\``)
                    .setColor(config.Embed.embedColor)
                    .addFields([
                        {
                            name: 'Old Status',
                            value: oldStatus ? '`✅ ENABLED`' : '`❌ DISABLED`',
                            inline: true
                        },
                        {
                            name: 'New Status',
                            value: config.Logs[event] ? '`✅ ENABLED`' : '`❌ DISABLED`',
                            inline: true
                        }
                    ])
                    .setTimestamp()
                    .setFooter({ 
                        text: `Updated by ${interaction.user.tag}`, 
                        iconURL: interaction.user.displayAvatarURL() 
                    });

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }
        }
    }
};
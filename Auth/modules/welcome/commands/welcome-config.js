const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config.yml', 'utf8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome-config')
        .setDescription('Configure welcome messages and settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View current welcome settings'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Set the welcome channel')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send welcome messages')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription('Set the welcome message')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('The welcome message (use {user} for mention, {server} for server name)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('toggle')
                .setDescription('Toggle welcome messages')
                .addBooleanOption(option =>
                    option.setName('enabled')
                        .setDescription('Enable or disable welcome messages')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('color')
                .setDescription('Set the welcome embed color')
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The hex color code (e.g., #ff0000)')
                        .setRequired(true))),

    execute: async (interaction) => {
        if (!config.Welcome) {
            config.Welcome = {
                enabled: false,
                channelId: null,
                message: "Welcome {user} to {server}! 🎉",
                color: config.Embed.embedColor
            };
            fs.writeFileSync('config.yml', yaml.dump(config));
        }

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'view': {
                const embed = new EmbedBuilder()
                    .setTitle('👋 Welcome Configuration')
                    .setColor(config.Welcome.color || config.Embed.embedColor)
                    .setThumbnail(config.Embed.footerIcon)
                    .addFields([
                        {
                            name: '📊 Status',
                            value: config.Welcome.enabled ? '`✅ ENABLED`' : '`❌ DISABLED`',
                            inline: true
                        },
                        {
                            name: '📝 Channel',
                            value: config.Welcome.channelId ? `<#${config.Welcome.channelId}>` : '`Not Set`',
                            inline: true
                        },
                        {
                            name: '🎨 Color',
                            value: `\`${config.Welcome.color || config.Embed.embedColor}\``,
                            inline: true
                        },
                        {
                            name: '📄 Message',
                            value: `\`\`\`${config.Welcome.message}\`\`\``
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
                config.Welcome.channelId = channel.id;
                fs.writeFileSync('config.yml', yaml.dump(config));

                const embed = new EmbedBuilder()
                    .setTitle('✅ Welcome Channel Updated')
                    .setDescription(`Welcome messages will now be sent to ${channel}`)
                    .setColor(config.Welcome.color || config.Embed.embedColor)
                    .setThumbnail(config.Embed.footerIcon)
                    .setTimestamp()
                    .setFooter({ 
                        text: `Updated by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }

            case 'message': {
                const message = interaction.options.getString('message');
                config.Welcome.message = message;
                fs.writeFileSync('config.yml', yaml.dump(config));

                const embed = new EmbedBuilder()
                    .setTitle('✅ Welcome Message Updated')
                    .setThumbnail(config.Embed.footerIcon)
                    .addFields([
                        {
                            name: '📝 New Message',
                            value: `\`\`\`${message}\`\`\``
                        },
                        {
                            name: '📋 Preview',
                            value: message
                                .replace('{user}', interaction.user)
                                .replace('{server}', interaction.guild.name)
                        }
                    ])
                    .setColor(config.Welcome.color || config.Embed.embedColor)
                    .setTimestamp()
                    .setFooter({ 
                        text: `Updated by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }

            case 'toggle': {
                const enabled = interaction.options.getBoolean('enabled');
                config.Welcome.enabled = enabled;
                fs.writeFileSync('config.yml', yaml.dump(config));

                const embed = new EmbedBuilder()
                    .setTitle('✅ Welcome System Updated')
                    .setDescription(`Welcome messages have been ${enabled ? 'enabled' : 'disabled'}`)
                    .setColor(config.Welcome.color || config.Embed.embedColor)
                    .setTimestamp()
                    .setFooter({ 
                        text: `Updated by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    });

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }

            case 'color': {
                const color = interaction.options.getString('color');
                if (!/^#[0-9A-F]{6}$/i.test(color)) {
                    await interaction.reply({ 
                        content: '❌ Please provide a valid hex color code (e.g., #ff0000)',
                        ephemeral: true 
                    });
                    return;
                }

                config.Welcome.color = color;
                fs.writeFileSync('config.yml', yaml.dump(config));

                const embed = new EmbedBuilder()
                    .setTitle('✅ Welcome Color Updated')
                    .setThumbnail(config.Embed.footerIcon)
                    .setDescription(`Welcome embed color has been set to \`${color}\``)
                    .setColor(color)
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
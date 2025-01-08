# 📦 Hex Bot Module Development Guide

## Module Configuration
Create a `module.json` file:

{
    "name": "Your Module",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "Description of your module",
    "enabled": true,
    "commands": [
        {
            "name": "command-name",
            "description": "Command description"
        }
    ]
}

## Module Entry Point

module.exports = {
    init(client, commands) {
        // Register commands
        commands.set('your-command', require('./commands/your-command'));

        // Register events
        client.on('eventName', (...args) => require('./events/your-event').execute(...args));
    }
};


## Creating Commands

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('command-name')
        .setDescription('Command description'),
    execute: async (interaction) => {
        // Your command logic here
    }
};

## Creating Events

module.exports = {
    name: 'eventName',
    execute: async (...args) => {
        // Your event logic here
    }
};

## Best Practices
- Use descriptive names for commands and events
- Follow the established embed styling
- Include proper error handling
- Document your code
- Test thoroughly before deployment

## Available Resources
- Access config: yaml.load(fs.readFileSync('config.yml', 'utf8'))
- Embed colors: Use config.Embed.embedColor
- Footer text: Use config.Embed.footerText

## Example Module

// module.json
{
    "name": "Greetings",
    "version": "1.0.0",
    "author": "Hex",
    "description": "Adds greeting commands",
    "enabled": true,
    "commands": [
        {
            "name": "hello",
            "description": "Says hello"
        }
    ]
}

// index.js
module.exports = {
    init(client, commands) {
        commands.set('hello', require('./commands/hello'));
    }
};

// commands/hello.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hello'),
    execute: async (interaction) => {
        const embed = new EmbedBuilder()
            .setTitle('👋 Hello!')
            .setDescription(`Hello ${interaction.user}!`)
            .setColor(config.Embed.embedColor);
        
        await interaction.reply({ embeds: [embed] });
    }
};

## Integration
- Create your module folder in modules/
- Add required files following the structure
- The bot will automatically load your module on startup

## Support
Join our Discord server for module development support and updates!

This guide provides everything needed to start creating modules for Hex Bot with proper structure and examples!






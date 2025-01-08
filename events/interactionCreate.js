module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.log("[System]:".yellow, `Command not found: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.log("[System]:".red, `Error executing command ${interaction.commandName}:`, error);
            const errorResponse = { 
                content: 'There was an error executing this command!', 
                ephemeral: true 
            };
            
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply(errorResponse);
            } else {
                await interaction.reply(errorResponse);
            }
        }
    },
};
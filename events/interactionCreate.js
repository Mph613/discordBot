module.exports = async (client, interaction) => {
    try {
        // If interaction is a button
        // Execute the respective code for the button
        if (interaction.isButton()){
            if (!client.buttons.has(interaction.customId)) return;
            return await client.buttons.get(interaction.customId).execute(client, interaction);
        };
        // If interaction is a select menu
        // Execute the respective code for the select menu
        if (interaction.isSelectMenu()){
            if (!client.selects.has(interaction.customId)) return;
            return await client.selects.get(interaction.customId).execute(client, interaction);
        };
        // If interaction is a command
        // Execute the respective code for the command
        if (!interaction.isCommand()) return;
        if (!client.commands.has(interaction.commandName)) return;
        return await client.commands.get(interaction.commandName).execute(client, interaction);
    } catch (error) {
        client.emit('error', error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
};
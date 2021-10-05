const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');

module.exports = async (client, message) => {
    try {
        // If the message is not from a bot
        if (message.author.bot) return;
        const setting = await Settings.findOne({guildId: message.guild.id});
        
        if (setting) {
            // If the message is from a game channel then execute the game function from the respective channel
            if (setting.oneWordCh == message.channel.id) client.games.get('oneWord').execute(client, message, setting);
            if (setting.countCh == message.channel.id) client.games.get('count').execute(client, message, setting);
            if (setting.hangmanCh == message.channel.id) client.games.get('hangman').execute(client, message, setting);
            if (setting.quizCh == message.channel.id) client.games.get('quiz').execute(client, message, setting);
        }
        // If the start of the message contains the prefix
        if (message.content.indexOf('-') !== 0) return;
        // Format the arguments
        const args = message.content.slice('-'.length).trim().split(/ +/g);
        // Format the message to get the command
        const command = args.shift().toLowerCase();
        // If the command exists then
        // Execute the code per the command
        if (!client.commands.has(command)) return;
        client.commands.get(command).executeText(client, message, args);
    } catch (error) {
        client.emit('error', error);
    }
};
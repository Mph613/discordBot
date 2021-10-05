const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const UserRankings = require('../models/UserRanking');
module.exports = async (client) => {
    try {
        // Inform that the bot is ready
        client.emit('info', `Ready! Logged in as ${client.user.tag}`);
        // Get the commands available to the bot
        const commands = client.commands.map(({ execute, ...data }) => data);
        // connect to the rest API of Discord for bot commands
        const rest = new REST({ version: '9' }).setToken(process.env.APP_KEY);
        // Inform that the bot started to refresh the available commands in the API
        client.emit('info', 'Started refreshing application (/) commands.');
        // For each guilds that is not 830848907381571664 add the availble commands in the bot API
        client.guilds.cache.forEach(async g => {
            if (g.id === '830848907381571664') return;
            await rest.put(Routes.applicationGuildCommands('815068078672052234', g.id), { body: commands });
        });
        // For each guild
        client.guilds.cache.forEach(g => {
            // For each members within the guild
            g.members.cache.forEach(m => {
                // Look up the user ranking
                UserRankings.findOne({ userId: m.id, guildId: m.guild.id }, async (err, result) => {
                    // If user ranking does not exist
                    if (!result) {
                        // Create user ranking
                        const userRanking = new UserRankings({
                            guildId: m.guild.id,
                            userId: m.id
                        });
                        await userRanking.save();
                    }
                });
            });
        });
        // Inform that the bot has reloaded the commands in the API & Created the user rankings of anyone missing in the database
        client.emit('info', 'Successfully reloaded application (/) commands.');
    } catch (error) {
        client.emit('error', error);
    }
};
const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');

module.exports = async (client, deletedMessages) => {
    try {
        // Get the guild settings from the database
        const setting = await Settings.findOne({guildId: deletedMessages.first().guildId});
        // If log channel exists
        if (setting && setting.logCh) {
            // Format output message
            const editEmbed = {
                color: '#0a77ec',
                author: {
                    name: `${deletedMessages.first().author.username}#${deletedMessages.first().author.discriminator}`,
                    icon_url: deletedMessages.first().author.displayAvatarURL({dynamic: true})
                },
                title: `:wastebasket:   Bulk Messages Deleted`,
                description: `<@${deletedMessages.first().author.id}> deleted ${deletedMessages.size} in <#${deletedMessages.first().channelId}>`,
                timestamp: new Date(),
                footer: {
                    text: 'Deleted on'
                }
            }
            // Send channel in the log channel
            const channel = await client.channels.fetch(setting.logCh);
            channel.send({embeds: [editEmbed]});
        }
    } catch (error) {
        client.emit('error', error);
    }
};
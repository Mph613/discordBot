const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');

module.exports = async (client, deletedMessage) => {
    try {
        if (!deletedMessage.author) return;
        if (deletedMessage.author.bot) return;
        // Get the delete messages log
        const fetchedLogs = await deletedMessage.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE'
        });
        const deletedLog = fetchedLogs.entries.first();
        if (!deletedLog) return;
        const {executor} = deletedLog;
        // Get the guild settings from the database
        const setting = await Settings.findOne({guildId: deletedMessage.guildId});
        // If the log channel exists
        if (setting && setting.logCh) {
            // Format the message output
            const editEmbed = {
                color: '#0a77ec',
                author: {
                    name: `${executor.username}#${executor.discriminator}`,
                    icon_url: executor.displayAvatarURL({dynamic: true})
                },
                title: `:wastebasket:   Message Deleted`,
                description: `They deleted <@${deletedMessage.author.id}> message in <#${deletedMessage.channelId}>`,
                fields: [
                    {
                        name: '**DELETED**',
                        value: '```\n' + deletedMessage.content + '```'
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Deleted on'
                }
            }
            // Send the output message to the log channel
            const channel = await client.channels.fetch(setting.logCh);
            channel.send({embeds: [editEmbed]});
        }
    } catch (error) {
        client.emit('error', error);
    }
};
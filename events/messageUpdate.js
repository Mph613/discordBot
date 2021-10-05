const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');

module.exports = async (client, oldMessage, newMessage) => {
    try {
        if (!oldMessage) return;
        if(newMessage.author.bot) return;
        // Get guild settings from database
        const setting = await Settings.findOne({guildId: newMessage.guildId});
        // If log channel exists
        if (setting && setting.logCh) {
            // Format message output
            const editEmbed = {
                color: '#0a77ec',
                author: {
                    name: `${newMessage.author.username}#${newMessage.author.discriminator}`,
                    icon_url: newMessage.author.displayAvatarURL({dynamic: true})
                },
                title: `:pencil2:   Message Edited`,
                description: `<@${newMessage.author.id}> edited in <#${newMessage.channelId}> this [message](https://discord.com/channels/${newMessage.guildId}/${newMessage.channelId}/${newMessage.id})`,
                fields: [
                    {
                        name: '**OLD**',
                        value: '```\n' + oldMessage.content + '```'
                    },
                    {
                        name: '**NEW**',
                        value: '```\n' + newMessage.content + '```'
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Edited on'
                }
            }
            // Send output message to the log channel
            const channel = await client.channels.fetch(setting.logCh);
            channel.send({embeds: [editEmbed]});
        }
    } catch (error) {
        client.emit('error', error);
    }
};
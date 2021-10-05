const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');
const Invites = require("../models/Invites");
const UserRankings = require("../models/UserRanking");

module.exports = async (client, ban) => {
    try {
        // Get the latest Ban log
        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD'
        });
        const banLog = fetchedLogs.entries.first();
        if (!banLog) return;
        const {executor} = banLog;
        // Get the guild settings to post it in the log channel
        const setting = await Settings.findOne({guildId: ban.guild.id});
        if (setting && setting.logCh) {
            // Format the output
            const banEmbed = {
                color: '#0a77ec',
                author: {
                    name: `${executor.username}#${executor.discriminator}`,
                    icon_url: executor.displayAvatarURL({dynamic: true})
                },
                title: `:hammer_pick:   Banned`,
                description: `They Banned <@${ban.user.id}>`,
                fields: [
                    {
                        name: '**Reason**',
                        value: '```\n' + ((banLog.reason) ? banLog.reason : 'N/A') + '```'
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Banned on'
                }
            }
            // Send the message
            const channel = await client.channels.fetch(setting.logCh);
            channel.send({embeds: [banEmbed]});
        }
    } catch (error) {
        client.emit('error', error);
    }
};
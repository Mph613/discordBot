const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');
const Invites = require("../models/Invites");
const UserRankings = require("../models/UserRanking");

module.exports = async (client, member) => {
    try {
        // Get the logs for member kicked and ban
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK'
        });
        const fetchedLogsBan = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD'
        });
        const kickLog = fetchedLogs.entries.first();
        const banLog = fetchedLogs.entries.first();
        if (!kickLog) return;
        if (kickLog.target.id === banLog.target.id) return;
        const {executor} = kickLog;
        // Get the server settings from the database
        const setting = await Settings.findOne({guildId: member.guild.id});
        // If there is a log channel
        if (setting && setting.logCh) {
            // Format the output
            const kickEmbed = {
                color: '#0a77ec',
                author: {
                    name: `${executor.username}#${executor.discriminator}`,
                    icon_url: executor.displayAvatarURL({dynamic: true})
                },
                title: `:hiking_boot:   Kicked`,
                description: `They kicked <@${member.id}>`,
                fields: [
                    {
                        name: '**Reason**',
                        value: '```\n' + ((kickLog.reason) ? kickLog.reason : 'N/A') + '```'
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Kicked on'
                }
            }
            // Send the output message
            const channel = await client.channels.fetch(setting.logCh);
            channel.send({embeds: [kickEmbed]});
        }
    } catch (error) {
        client.emit('error', error);
    }
};
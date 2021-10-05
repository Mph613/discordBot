const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');
const Invites = require("../models/Invites");
const UserRankings = require("../models/UserRanking");

module.exports = async (client, ban) => {
    try {
        // Get the ban remove log
        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE'
        });
        const unbanLog = fetchedLogs.entries.first();
        if (!unbanLog) return;
        const {executor} = unbanLog;
        // Get the setting for the guild to get the log channel
        const setting = await Settings.findOne({guildId: ban.guild.id});
        if (setting && setting.logCh) {
            // Format the output
            const unbanEmbed = {
                color: '#0a77ec',
                author: {
                    name: `${executor.username}#${executor.discriminator}`,
                    icon_url: executor.displayAvatarURL({dynamic: true})
                },
                title: `:wrench:   Unbanned`,
                description: `They Unbanned <@${ban.user.id}>`,
                timestamp: new Date(),
                footer: {
                    text: 'Unbanned on'
                }
            }
            // Post the output
            const channel = await client.channels.fetch(setting.logCh);
            channel.send({embeds: [unbanEmbed]});
        }
    } catch (error) {
        client.emit('error', error);
    }
};
const Settings = require("../models/settings");
const Invites = require('../models/Invites');
module.exports = async (client, invite) => {
    try {
        // Remove the invite info from the database
        await Invites.deleteOne({code: invite.code});
        // Get the guild settings from database
        const setting = await Settings.findOne({guildId: invite.guild.id});
        // Get the invite deleted logs
        const fetchedLogs = await invite.guild.fetchAuditLogs({
            limit: 1,
            type: 'INVITE_DELETE'
        });
        const delInviteLog = fetchedLogs.entries.first();
        if (!delInviteLog) return;
        const {executor} = delInviteLog;
        // If the log channel exists
        if (setting && setting.logCh) {
            // Format the output
            const logEmbed = {
                color: '#0a77ec',
                author: {
                    name: `${executor.username}#${executor.discriminator}`,
                    icon_url: executor.displayAvatarURL({dynamic: true})
                },
                title: ':outbox_tray:   Invite Deleted',
                description: '```\n' + `https://discord.gg/${invite.code}` + '```',
                timestamp: new Date(),
                footer: {
                    text: 'Deleted on'
                }
            };
            // Send the output message into the log channel
            const channel = await client.channels.fetch(setting.logCh);
            channel.send({embeds: [logEmbed]});
        }
    } catch (error) {
        client.emit('error', error);
    }
};
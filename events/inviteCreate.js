const Invites = require("../models/Invites");
const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');
module.exports = async (client, invite) => {
    try {
        // Create an Invite database object
        const inviteInfo = new Invites({
            guildId: invite.guild.id,
            creatorId: invite.inviter.id,
            code: invite.code,
            uses: 0
        });
        await inviteInfo.save();
        // Get guild settings
        const setting = await Settings.findOne({guildId: invite.guild.id});
        // If a log channel exist
        if (setting && setting.logCh) {
            let guild = await client.guilds.fetch(invite.guild.id);
            let member = await guild.members.fetch(invite.inviter.id);
            // Format the output message
            const logEmbed = {
                color: '#0a77ec',
                author: {
                    name: `${member.user.username}#${member.user.discriminator}`,
                    icon_url: member.user.displayAvatarURL({dynamic: true})
                },
                title: ':inbox_tray:   Invite Created',
                description: '```\n'+ `https://discord.gg/${invite.code}` + '```',
                timestamp: new Date(),
                footer: {
                    text: 'Created on'
                }
            };
            // Send the output message in the log channel
            const channel = await client.channels.fetch(setting.logCh);
            channel.send({embeds: [logEmbed]});
        }
    } catch (error) {
        client.emit('error', error);
    }
};
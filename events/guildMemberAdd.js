const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');
const Invites = require("../models/Invites");
const UserRankings = require("../models/UserRanking");

module.exports = async (client, member) => {
    try {
        // Create a datase object for the new user
        const nUserRank = new UserRankings({
            guildId: member.guild.id,
            userId: member.id
        });
        // Save it
        await nUserRank.save();
        // Get the server settings & the invitte links that are in the guild
        const setting = await Settings.findOne({guildId: member.guild.id});
        const invites = await member.guild.invites.fetch();
        // For each invite on the server
        invites.forEach(async (i) => {
            // Get the invite info from the database
            const inviteInfo = await Invites.findOne({guildId: member.guild.id, code: i.code});
            // If the invite info exists in the database
            if (inviteInfo) {
                // then check to see if it has been used
                if (inviteInfo.uses != i.uses) {
                    // Since it is been used get the creators user ranking database object
                    // If it exist then reward the person who has created the invite link
                    const user = await UserRankings.findOne({guildId: member.guild.id, userId: inviteInfo.creatorId});
                    // If the user has not ranking object create one
                    if (!user) {
                        const nUserRanking = new UserRankings({
                            guildId: member.guild.id,
                            userId: inviteInfo.creatorId,
                            money: (10 * setting.expModifier),
                            recruited: 1
                        });
                        inviteInfo.uses += 1;
                        await inviteInfo.save();
                        await nUserRanking.save();
                    }else{
                        inviteInfo.uses += 1;
                        user.money += (10 * setting.expModifier);
                        await inviteInfo.save();
                        await user.save();
                    }
                }

                
            }
        });
        // If the server has a gate channel
        if (setting && setting.gatesCh) {
            // Format the output
            let txt = `<@${member.id}> is member #${member.guild.memberCount.toString().split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," )}\n`;
            const gatesEmbed = {
                description: `**Account Created:** ${member.user.createdAt}\n\n**User Joined:** ${member.joinedAt}`,
            };
            // Post the output in the gate channel
            const channel = await client.channels.fetch(setting.gatesCh);
            channel.send({content: txt, embeds: [gatesEmbed]});
        }
    } catch (error) {
        client.emit('error', error);
    }
};
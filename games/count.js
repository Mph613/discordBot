// No comments done, still debuging and testing
const UserRankings = require("../models/UserRanking");
const calStr = require('calculate-string');
module.exports = {
	name: 'count',
	description: 'Add one to the last number',
    rules: [
        'You must add 1 to the previous number', 
        'You may only type a number after another person has typed a number.',
        'You must start from 0 after the chain is broken.',
        'You may use equations to represent the number.',
        'You lose 3$ every time you break a rule.',
        'For every number you successfully add, you gain 1$'
    ],
    async execute(client, message, settings) {
        try {
            console.log('Game event for Count');            
            let losing = 0;
            let brokenRules = [];
            const lst2Messages = await message.channel.messages.fetch({limit: 2});
            const num = calStr(message.content);
            
            console.log(num);
            console.log(`LAST: ${calStr(lst2Messages.last().content)} | FIRST: ${calStr(lst2Messages.first().content)}`);

            if (lst2Messages.size > 1) {
                if (lst2Messages.last().embeds[0]) {
                    if (lst2Messages.last().embeds[0].footer.text === message.author.id) {
                        brokenRules.push(2);
                        losing += 3;
                    }
                    if (lst2Messages.last().embeds[0].description.includes('EVERYONE START AT 0') && calStr(lst2Messages.first().content) != 0) {
                        brokenRules.push(3);
                        losing += 3;
                    }
                }else {
                    if (calStr(lst2Messages.first().content) - calStr(lst2Messages.last().content) != 1){
                        brokenRules.push(1);
                        losing += 3;
                    }
                }
                if (!brokenRules.includes(2)) {
                    if (lst2Messages.first().author.id === lst2Messages.last().author.id ) {
                        brokenRules.push(2);
                        losing += 3;
                    }
                }
            }else{
                if (calStr(lst2Messages.first().content) != 0) {
                    brokenRules.push(3);
                    losing += 3;
                }
            }
            const userRanking = await UserRankings.findOne({guildId: message.guild.id, userId: message.author.id});
            if (losing > 0) {
                const lostEmbed = {
                    author: {
                        name: `${message.author.username}#${message.author.discriminator}`,
                        icon_url: message.author.avatarURL()
                    },
                    title: `You: ${calStr(message.content)} | Previous: ${calStr(lst2Messages.last().content)}`,
                    description: `**Broken Rules**\n#${brokenRules.join(', #')}\nYou lost ${losing} ${settings.currencyName}\n\n**Remember**\n${this.rules.join('\n')}\n\n**EVERYONE START AT 0**`,
                    footer: {
                        text: message.author.id
                    }
                };
                if (!userRanking) {
                    const uRanking = new UserRankings({
                        guildId: message.guild.id,
                        userId: message.author.id,
                        money: (0 - losing)
                    });
                    uRanking.save();
                    return await message.react('👌');
                }
                await lst2Messages.first().delete();
                message.channel.send({embeds: [lostEmbed]});
                userRanking.money -= losing;
            } else {
                if (!userRanking) {
                    const uRanking = new UserRankings({
                        guildId: message.guild.id,
                        userId: message.author.id,
                        money: (0 + (1 * settings.moneyModifier))
                    });
                    settings.currencyTotal += 1;
                    uRanking.save();
                    settings.save();
                    return await message.react('👌');
                }
                settings.currencyTotal += 1;
                userRanking.money += (1 * settings.moneyModifier);
                settings.save();
                await message.react('👌');
            }
            userRanking.save();
        } catch (error) {
            client.emit('error', error);
        }
    }
};
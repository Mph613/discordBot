// No comments done, still debuging and testing
const UserRankings = require("../models/UserRanking");

module.exports = {
	name: 'hangman',
	description: 'Save the stick figure before they get hanged.',
    rules: [
        'You may guess one letter at a time.', 
        'You may only type a word after another person has typed a word.',
        'You lose 3$ every time you break a rule.',
        'For every word you successfully send, you gain 0.50$'
    ],
    async execute(client, message, settings) {
        try {
            console.log('Game event for Hangman');            
            let losing = 0;
            let brokenRules = [];
            const lst2Messages = await message.channel.messages.fetch({limit: 2});
            if (message.content.split(' ').length > 1) {
                brokenRules.push(1);
                losing += 3;
            }
            console.log(lst2Messages.size);
            if (lst2Messages.size > 1) {
                if (lst2Messages.last().embeds[0]) {
                    if (lst2Messages.last().embeds[0].footer.text === message.author.id) {
                        brokenRules.push(2);
                        losing += 3;
                    }
                }
    
                if (!brokenRules.includes(2)) {
                    if (lst2Messages.first().author.id === lst2Messages.last().author.id ) {
                        brokenRules.push(2);
                        losing += 3;
                    }
                }
            }
            const userRanking = await UserRankings.findOne({guildId: message.guild.id, userId: message.author.id});
            if (losing > 0) {
                const lostEmbed = {
                    author: {
                        name: `${message.author.username}#${message.author.discriminator}`,
                        icon_url: message.author.avatarURL()
                    },
                    title: `Message: ${message.content}`,
                    description: `**Broken Rules**\n#${brokenRules.join(', #')}\nYou lost ${losing} ${settings.currencyName}\n\n**Remember**\n${this.rules.join('\n')}`,
                    footer: {
                        text: message.author.id
                    }
                };
                await lst2Messages.first().delete();
                message.channel.send({embeds: [lostEmbed]});
                userRanking.money -= losing;
            } else {
                settings.currencyTotal += 0.50;
                userRanking.money += (0.50 * settings.moneyModifier);
                settings.save();
                await message.react('👌');
            }
            userRanking.save();
        } catch (error) {
            console.log(error);
            // client.emit('error', error);
        }
    }
};
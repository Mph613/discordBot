// No comments done, still debuging and testing
const UserRankings = require("../models/UserRanking");
const quiz = require('../config/quiz.json');
let paused = false;
let numTillQuiz = 0;
module.exports = {
    name: 'quiz',
    description: 'Random quiz',
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
            console.log('Game event for Quiz');
            // console.log(quiz);

            if (numTillQuiz >= 8) {
                paused = true;
                numTillQuiz = 0;
                const item = quiz[Math.floor(Math.random() * quiz.length)];
                const filter = response => {
                    return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
                }
                message.channel.send(`${item.question}`, { fetchReply: true })
                    .then(() => {
                        message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                            .then(async collected => {
                                // console.log(collected);
                                message.channel.send(`${collected.first().author} got the answer & won 0.50 eCoins!`);
                                paused = false;
                                const userRanking = await UserRankings.findOne({guildId: collected.first().guild.id, userId: collected.first().author.id});
                                if (!userRanking) {
                                    const uRanking = new UserRankings({
                                        guildId: message.guild.id,
                                        userId: message.author.id,
                                        money: (0.50 * moneyModifier)
                                    });
                                    uRanking.save();
                                }
                            })
                            .catch(collected => {
                                message.channel.send('Looks like nobody got the answer this time!');
                                paused = false;
                            });
                    });
            }
            if (!paused) numTillQuiz++;
        } catch (error) {
            client.emit('error', error);
        }
    }
};
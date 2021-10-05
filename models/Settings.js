const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    guildId: String,
    adminRole: String,
    modRole: String,
    ruleChannelId: String,
    currencyName: String,
    currencyTotal: Number,
    publicBotChannelId: String,
    welcomeCh: String,
    electionsCh: String,
    squadsCh: String,
    adminCh: String,
    logCh: String,
    gatesCh: String,
    hangmanCh: String,
    oneWordCh: String,
    countCh: String,
    quizCh: String,
    neededVotes: Number,
    expModifier: Number,
    moneyModifier: Number
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
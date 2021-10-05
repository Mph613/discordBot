const mongoose = require('mongoose');

const userRankingsSchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    money: {type: Number, default: 0.0},
    txtLevel: {type: Number, default: 0},
    vcLevel: {type: Number, default: 0},
    fame: {type: Number, default: 0},
    bannerBG: {type: String, default: 'default'},
    expColor: {type: String, default: 'default'},
    fontColor: {type: String, default: 'default'},
    recruited: {type: Number, default: 0},
}, { timestamps: true });

const UserRankings = mongoose.model('UserRankings', userRankingsSchema);

module.exports = UserRankings;
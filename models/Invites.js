const mongoose = require('mongoose');

const invitesSchema = new mongoose.Schema({
    guildId: String,
    creatorId: String,
    code: String,
    uses: Number
}, { timestamps: true });

const Invites = mongoose.model('Invites', invitesSchema);

module.exports = Invites;
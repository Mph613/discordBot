const Settings = require("../models/settings");

module.exports = {
	name: 'setting',
	description: 'Change bot settings',
	async execute(client, interaction) {
        try {
            interaction.reply({content: 'hello'});
        } catch (error) {
            client.emit('error', error);
        }
	},
    async executeText(client, message, args) {
        try {
            // Get the bot settings for the guild
            const setting = await Settings.findOne({guildId: message.guild.id});
            if (!setting) await this.executeCreateSettings(client, message);
            // Teach the bot what is the mod id
            if (args[0].toLowerCase() === 'mods') {
                if (message.author.id != message.guild.ownerId) return message.channel.send('You must be the server owner to run this command!')
                setting.modRole = args[1];
                setting.save();
                await message.channel.send(`I have learned that <@&${args[1]}> is the mod role!`);
            }
            // Teach the bot what is the admin id
            if (args[0].toLowerCase() === 'admin') {
                if (message.author.id != message.guild.ownerId) return message.channel.send('You must be the server owner to run this command!')
                setting.adminRole = args[1];
                setting.save();
                await message.channel.send(`I have learned that <@&${args[1]}> is the admin role!`);
            }
            // Teach the bot where the log channel is
            if (args[0].toLowerCase() === 'logs') {
                if (message.author.id != message.guild.ownerId) return message.channel.send('You must be the server owner to run this command!')
                setting.logCh = args[1];
                setting.save();
                await message.channel.send(`I have learned that <#${args[1]}> is the log channel!`);
            }
            // Teach the bot where the gate channel is
            if (args[0].toLowerCase() === 'gates') {
                if (message.author.id != message.guild.ownerId) return message.channel.send('You must be the server owner to run this command!')
                setting.gatesCh = args[1];
                setting.save();
                await message.channel.send(`I have learned that <#${args[1]}> is the gates channel!`);
            }
            // Teach the bot where the hangman channel is
            if (args[0].toLowerCase() === 'hangman') {
                if (message.author.id != message.guild.ownerId) return message.channel.send('You must be the server owner to run this command!')
                setting.hangmanCh = args[1];
                setting.save();
                await message.channel.send(`I have learned where <#${args[1]}> is located!`);
            }
            // Teach the bot where the oneword channel is
            if (args[0].toLowerCase() === 'oneword') {
                if (message.author.id != message.guild.ownerId) return message.channel.send('You must be the server owner to run this command!')
                setting.oneWordCh = args[1];
                setting.save();
                await message.channel.send(`I have learned where <#${args[1]}> is located!`);
            }
            // Teach the bot where the count channel is
            if (args[0].toLowerCase() === 'count') {
                if (message.author.id != message.guild.ownerId) return message.channel.send('You must be the server owner to run this command!')
                setting.countCh = args[1];
                setting.save();
                await message.channel.send(`I have learned where <#${args[1]}> is located!`);
            }
            // Teach the bot where the quiz channel is
            if (args[0].toLowerCase() === 'quiz') {
                if (message.author.id != message.guild.ownerId) return message.channel.send('You must be the server owner to run this command!')
                setting.quizCh = args[1];
                setting.save();
                await message.channel.send(`I will be posting quizzes in <#${args[1]}>!`);
            }
        } catch (error) {
            message.channel.send('Something went wrong try again~');
            console.log(error);
        }
    },
    // Function to create the settings in the dabase for the guild
    async executeCreateSettings(client, message) {
        try {
            const setting = new Settings({
                guildId: message.guild.id,
                currencyName: 'eCoins',
                currencyTotal: 0
            });
            setting.save();
        } catch (error) {
            client.emit('error', error);
        }
    }
};
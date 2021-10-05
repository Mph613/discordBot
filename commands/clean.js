module.exports = {
	name: 'clean',
	description: 'Clean up a channel',
    options: [{
        name: 'amount',
        description: 'The amount of messages to remove, add 1 to delete your own',
        required: true,
        type: 4
    }],
    // Code to be launched if it used by the / bot command API
	async execute(client, interaction) {
        try {
            this.executeText(client, interaction.message, [interaction.options.getInteger('amount')])
            // console.log(interaction.options);
            // const member = interaction.member;
            // const channel = await client.channels.fetch(interaction.channelId)
            // const message = await channel.messages.fetch({ limit: 1 });
            // console.log(message);
            // if (member.permissions.has('MANAGE_MESSAGES') != true) return channel.send('Permission denied. You do not have the required permissions');
            // await message.channel.bulkDelete(interaction.options.getInteger('amount'));
            // message.channel.send(`Deleted ${interaction.options.getInteger('amount')} messages`)
            //     .then(msg => {
            //         msg.delete({ timeout: 3000 });
            // });
            interaction.update({});
        } catch (error) {
            client.emit('error', error);
        }
	},
    // COde to be launched if it used directly with the messages
    async executeText(client, message, args) {
        try {
            // Get the guild member object from the user id of the one who is using the clean command            
            let member = message.guild.members.cache.find(m => m.id === message.author.id);
            // Check to see if the user has the permission to delete messages
            if (member.permissions.has('MANAGE_MESSAGES') != true) return message.channel.send('Permission denied. You do not have the required permissions');
            // Delete the message from the specified amount
            await message.channel.bulkDelete(args[0]);
            // Send the success message and delete it after 3000 miliseconds passed
            message.channel.send(`Deleted ${args[0]} messages`)
                .then(msg => {
                    msg.delete({ timeout: 3000 });
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
};
// Model for building commands
module.exports = {
	name: 'test',
	description: 'This is a test command',
	async execute(client, interaction) {
        try {
            interaction.reply({content: 'hello'});
        } catch (error) {
            client.emit('error', error);
        }
	},
    async executeText(client, message, args) {
        try {
            message.channel.send('hello');
        } catch (error) {
            client.emit('error', error);
        }
    }
};
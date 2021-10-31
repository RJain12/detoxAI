module.exports = {
	name: 'interactionCreate',
};

const { Permissions } = require('discord.js');

module.exports.run = async (interaction, client, db) => {
	if (!interaction.guild) return interaction.reply('You must run commands in a server.\nJoin our official server for help: https://discord.gg/zNYWJeU3g5');
	if (!interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return interaction.reply('Oops! I do not have permissions to send messsages here!\nPlease tell an admin to give me the `SEND_MESSAGES` permission!');
	if (interaction.isCommand()) {
		if (!client.commands.has(interaction.commandName)) return;
		try {
			console.log(interaction.commandName);
			return client.commands.get(interaction.commandName).run(interaction, client, db, interaction.guild, interaction.member);
		}
		catch (error) {
			console.error(error);
			return interaction.reply({ content: 'There was an error while executing that command!\nVisit our support server fer help: https://discord.gg/zNYWJeU3g5', ephemeral: true });
		}
	}
};
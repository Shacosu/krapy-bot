const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dbClient = require('../../libs/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('users')
		.setDescription('Muestra los usuarios registrados en KrapyGames!'),
	async execute(interaction) {
		const users = await dbClient.db('gestiondb').collection('users').find({}).toArray();
		const embedUsers = new EmbedBuilder()
			.setTitle('Usuarios')
			.setDescription('Muestra los usuarios registrados en KrapyGames!')
			.addFields({
				name: 'Usuarios registrados',
				value: JSON.stringify(users.length),
			})
			.setColor('#0099ff')
		await interaction.reply({ embeds: [embedUsers] });
	},
};
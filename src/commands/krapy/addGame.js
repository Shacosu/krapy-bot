const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dbClient = require('../../libs/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('krapy')
        .setDescription('Añade un juego a la base de datos de KrapyGames!')
        .addStringOption(option => option.setName('add').setDescription('Añade un juego a la base de datos de KrapyGames!').setRequired(true))
        // Add category of the game choises
        .addStringOption(option =>
			option.setName('category')
				.setDescription('Selecciona la categoria del juego.')
				.setRequired(true)
				.addChoices(
					{ name: 'PC', value: 'pc' },
					{ name: 'XBOX', value: 'xbox' },
					{ name: 'SWITCH', value: 'switch' },
					{ name: 'PS5', value: 'ps5' },
				)),
    async execute(interaction) {
        try {
            const links = await dbClient.db('gestiondb').collection('links').find({}).toArray();
            let input = await interaction.options.getString('add')
            let category = await interaction.options.getString('category')
            console.log(category)
            if (!input || !category) return interaction.reply('No se ha encontrado el link o la categoria');
            if (links.find(link => link.link.toLowerCase() === input.toLowerCase())) return interaction.reply('El juego ya existe en la base de datos');
            const categories = await dbClient.db('gestiondb').collection('collections').find({}).toArray();
            const categoryId = categories.filter(cat => cat.name.toLowerCase() === category.toLowerCase());
            if (!categoryId.length) return interaction.reply('La categoria no existe en la base de datos');
            const game = await dbClient.db('gestiondb').collection('links').insertOne({ link: input, category: categoryId[0]._id });
            console.log(game)
            await interaction.reply(`El juego ${input} ha sido añadido a la base de datos!`);
        } catch (error) {
            console.log(error)
        }
    },
};
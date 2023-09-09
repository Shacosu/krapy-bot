const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dbClient = require('../../libs/db');

const permissionRoles = ['833353225117368340', '1117945527036805311'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('krapy')
        .setDescription('Añade un juego a la base de datos de KrapyGames!')
        .addStringOption(option => option.setName('add').setDescription('Añade un juego a la base de datos de KrapyGames!').setRequired(true))
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
            const memberRoles = interaction.member.roles.cache.map(role => role.id)
            if (!permissionRoles.some(x => memberRoles.includes(x))) return interaction.reply('No tienes permisos para ejecutar este comando');
            let input = await interaction.options.getString('add')
            let category = await interaction.options.getString('category');
            if (!input || !category) return interaction.reply('No se ha encontrado el link o la categoria');

            const links = await dbClient.db('gestiondb').collection('links').find({}).toArray();
            if (links.find(link => link.link.toLowerCase() === input.toLowerCase())) return interaction.reply('El juego ya existe en la base de datos');

            const categories = await dbClient.db('gestiondb').collection('collections').find({}).toArray();
            const categoryId = categories.filter(cat => cat.name.toLowerCase() === category.toLowerCase());
            if (!categoryId.length) return interaction.reply('La categoria no existe en la base de datos');

            await dbClient.db('gestiondb').collection('links').insertOne({ link: input, category: categoryId[0]._id, createdAt: new Date(), updatedAt: new Date(), __v: 0 });
            await interaction.reply(`El juego ${input} ha sido añadido a la base de datos!`);
        } catch (error) {
            await interaction.reply('Ocurrio un error ingresando el juego a la base de datos!');
            console.log(error)
        }
    },
};
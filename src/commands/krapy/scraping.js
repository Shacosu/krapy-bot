require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const wait = require('node:timers/promises').setTimeout;

const permissionRoles = process.env.ROLES_ID.split(',')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start-scraping')
        .setDescription('Comandos de KrapyGames'),
    async execute(interaction) {
        try {
            const memberRoles = interaction.member.roles.cache.map(role => role.id)
            if (!permissionRoles.some(x => memberRoles.includes(x))) return interaction.reply('No tienes permisos para ejecutar este comando').then(() => setTimeout(() => interaction.deleteReply(), 5000));
            console.time('Scraping')
            await interaction.reply({ content: `**[🚀] Iniciando scraping de juegos...**` }).catch((err) => console.log('Error respondiendo mensaje'))
            await axios.get('http://3.142.165.44/api/scrap')
            await interaction.editReply({ content: `**[✅] Scraping de juegos finalizado!**` }).catch((err) => console.log('Error editando mensaje'))
            await wait(2000)
            await interaction.deleteReply()
            console.timeEnd('Scraping')

        } catch (error) {
            if (error instanceof axios.AxiosError) return await interaction.followUp('Ocurrio un error con el scraping de juegos!', error.message);
            await interaction.followUp('Ocurrio un error con el scraping de juegos!');
            console.log(error)
        }
    },
};
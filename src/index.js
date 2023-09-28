require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');

require('./libs/dbMysql')

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if ('data' in command && 'execute' in command) {
        	client.commands.set(command.data.name, command);
        } else {
        	console.log(`[CUIDADO] El comando en ${filePath} requiere de la propiedad "data" y "execute".`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`El comando ${interaction.commandName} no ha sido encontrado.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Ocurrio un error ejecutando el comando!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Ocurrio un error ejecutando el comando!', ephemeral: true });
        }
    }
});


client.once(Events.ClientReady, client => {
    console.log(`Bot preparado y encendido como: ${client.user.tag} 🚀`);
    
    client.user.setActivity('Krapymeños', { type: ActivityType.Watching });
});

client.login(process.env.BOT_SECRET_TOKEN);
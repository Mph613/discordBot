const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER']
});
const winston = require('winston');
const chalk = require("chalk");
const mongoose = require("mongoose");
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env.dahBot" });

// Create empty Collection for the commands
client.commands = new Collection();
client.buttons = new Collection();
client.selects = new Collection();
client.games = new Collection();

// Configure the database and use the new methods of mongoose to connect to Database

mongoose.connect(process.env.MONGODB_URL);

// Get all the command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// For each commands
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

// Get all the event files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// For each events
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    // Bind client events to the respective code    
    client.on(eventName, event.bind(null, client));
}

const buttonFiles = fs.readdirSync(`./buttons`).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
    const button = require(`./buttons/${file}`);
    client.buttons.set(button.customId, button);
}

const selectFiles = fs.readdirSync(`./selects`).filter(file => file.endsWith('.js'));

for (const file of selectFiles) {
    const select = require(`./selects/${file}`);
    client.selects.set(select.customId, select);
}

const gameFiles = fs.readdirSync(`./games`).filter(file => file.endsWith('.js'));

for (const file of gameFiles) {
    const game = require(`./games/${file}`);
    client.games.set(game.name, game);
}

// Configure logger
// Diferent log levels
const logLevels = {
    levels: {
        debug: 0,
        info: 1,
        warn: 1,
        error: 1
    },
    colors: {
        debug: 'green',
        info: 'cyan',
        warn: 'yellow',
        error: 'red'
    }
}

// Create logger & format the display
const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({})
    ],
    format: winston.format.printf((log) => {
        // console.log(log);
        switch (log.level) {
            case 'debug':
                return `[${chalk.greenBright('DEBUG')}]\n${chalk.greenBright(log.message)}`;
            case 'info':
                return `[${chalk.cyanBright('INFO')}] - ${chalk.cyanBright(log.message)}`;
            case 'warn':
                return `[${chalk.yellowBright('WARN')}]\n${chalk.yellowBright(log.message)}`;
            case 'error':
                return `[${chalk.redBright('ERROR')}]\n${chalk.redBright(log.message)}`;
            default:
                break;
        }
    }),
    levels: logLevels.levels
});

// Listener on client events to log
client.on('info', m => logger.info(m));
// client.on('debug', m => logger.debug(m));
client.on('warn', m => logger.warn(m));
client.on('error', m => logger.error(m));
process.on('uncaughtException', error => logger.error(error));
process.on('unhandledRejectio2n', error => logger.error(error));
// Database listener
mongoose.connection.on("error", (err) => {
    client.emit('error', err);
});

// Login the bot
client.login(process.env.APP_KEY);
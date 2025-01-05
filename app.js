const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./utils/config');
const os = require('os');

const app = express();

// Bot instance
const Bot = require('./bot/index');
const bot = new Bot();

// Initialize bot status as offline
bot.status = 'offline';

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: config.get('website.session_secret'),
    resave: false,
    saveUninitialized: false
}));

// Get real-time bot stats
const getBotStats = () => ({
    serverCount: bot.client?.guilds.cache.size || 0,
    userCount: bot.client?.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0) || 0,
    status: bot.status,
    commandCount: Array.isArray(config.get('commands.enabled')) ? config.get('commands.enabled').length : 0
});

// Routes
app.get('/', (req, res) => {
    const stats = getBotStats();
    res.render('index', {
        config: config,
        bot: {
            guilds: { size: stats.serverCount },
            users: { size: stats.userCount }
        },
        serverCount: stats.serverCount,
        userCount: stats.userCount,
        commandCount: stats.commandCount
    });
});
app.get('/dashboard', (req, res) => {
    const stats = getBotStats();
    res.render('dashboard', {
        config: config,
        botStatus: stats.status,
        bot: bot,
        guildCount: stats.serverCount,
        userCount: stats.userCount
    });
});

// Bot control endpoints
app.post('/api/bot/start', async (req, res) => {
    try {
        await bot.start();
        res.json({ status: 'success', botStatus: bot.status });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/api/bot/stop', async (req, res) => {
    try {
        await bot.stop();
        res.json({ status: 'success', botStatus: bot.status });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/api/bot/restart', async (req, res) => {
    try {
        await bot.restart();
        res.json({ status: 'success', botStatus: bot.status });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Start bot when server starts
bot.start().then(() => {
    console.log('Bot started successfully');
}).catch(console.error);

const PORT = config.get('website.port') || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
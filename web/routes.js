const fetch = require('node-fetch');
const btoa = require('btoa');
const { Client } = require('pg');

const config = require('./config');

const { catchAsync } = require('./utils');
const middlewares = require('./middlewares');
const database = require('./database');
const discord = require('./discord');

module.exports = function(app) {

    app.get('/', middlewares.isntAuthentificated, async function(req, res) {
        res.render('main.ejs', {config: config, page: null});
    });



    /**
     * LOGIN & LOGOUT
     */
    app.get('/login', (req, res) => {
        let urlCallback = `https://discordapp.com/api/oauth2/authorize?client_id=${config.CLIENT_ID}&redirect_uri=${config.REDIRECT}&response_type=code&scope=identify`;
        res.redirect(urlCallback);
    });



    app.get('/logincallback', catchAsync(async (req, res) => {
        if (!req.query.code) throw new Error('NoCodeProvided');
        
        const code = req.query.code;
        const creds = btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`);
        
        const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${config.REDIRECT}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            },
        });

        const json = await response.json();

        req.session.access_token = json.access_token;


        let auth = await discord.getDiscordIdentity(req.session.access_token);

        let servers = await database.getServers(auth.id);
        if(servers.rows && servers.rows.length > 0) {
            req.session.serverInConfig = servers.rows[0].id;
        }


        res.redirect('/');
    }));



    app.get('/logout', function(req, res) {
        req.session.destroy(function(err) {
            
        });

        res.redirect('/');
    });




    /**
     * Set server config
     */
    app.post('/setServerInConfiguration', middlewares.isAuthentificated, async function(req, res) {
        req.session.serverInConfig = req.body.selectServer;
        res.redirect(req.header('Referer') || '/');
    });



    /**
     * grades management
     */
    app.get('/grades', middlewares.isAuthentificated, async function(req, res) {
        let servers = await database.getServers(res.locals.auth.id);
        let ranks = await database.getRanks(res.locals.auth.id, req.session.serverInConfig);

        res.render('grades.ejs', {config: config, auth: res.locals.auth, page: 'grades', servers: servers.rows, ranks: ranks.rows, defaultServerId: req.session.serverInConfig});
    });



    app.post('/actionAddRank', middlewares.isAuthentificated, async function(req, res) {
        await database.addRank(res.locals.auth.id, req.session.serverInConfig, req.body.nomRank).catch(() => {});
        res.redirect(req.header('Referer') || '/');
    });



    app.get('/actionDelRank', middlewares.isAuthentificated, async function(req, res) {
        if(req.query.id) {
            await database.delRank(res.locals.auth.id, req.session.serverInConfig, req.query.id).catch(() => {});
        }

        res.redirect(req.header('Referer') || '/');
    });



    /**
     * command management
     */
    app.get('/commandes', middlewares.isAuthentificated, async function(req, res) {
        let servers = await database.getServers(res.locals.auth.id);
        let sanctions = await database.getSanctions();
        let commands = await database.getCommandsServer(res.locals.auth.id, req.session.serverInConfig);

        res.render('commandes.ejs', {config: config, auth: res.locals.auth, page: 'commandes', servers: servers.rows, sanctions: sanctions.rows, commands: commands.rows, defaultServerId: req.session.serverInConfig});
    });



    app.post('/actionAddCommand', middlewares.isAuthentificated, async function(req, res) {
        await database.addCommandsServer(res.locals.auth.id, req.session.serverInConfig, req.body.pattern_command, req.body.sanction_name).catch(() => {});
        res.redirect(req.header('Referer') || '/');
    });



    app.get('/actionDelCommand', middlewares.isAuthentificated, async function(req, res) {
        if(req.query.id) {
            await database.delCommandServer(res.locals.auth.id, req.session.serverInConfig, req.query.id).catch(() => {});
        }

        res.redirect(req.header('Referer') || '/');
    });



    /**
     * commandes-grades liaisons managements
     */
    app.get('/commandes-grades', middlewares.isAuthentificated, async function(req, res) {
        let servers = await database.getServers(res.locals.auth.id);

        let commands = await database.getCommandsServer(res.locals.auth.id, req.session.serverInConfig);
        let ranks = await database.getRanks(res.locals.auth.id, req.session.serverInConfig);

        let commandsRanks = await database.getLiaisonCommandRankServer(res.locals.auth.id, req.session.serverInConfig);

        res.render('commandes-grades.ejs', {config: config, auth: res.locals.auth, page: 'commandes-grades', servers: servers.rows, commands: commands.rows, ranks: ranks.rows, commandsRanks: commandsRanks.rows, defaultServerId: req.session.serverInConfig});
    });



    app.get('/actionDelcommandes-grades', middlewares.isAuthentificated, async function(req, res) {
        if(req.query.command_id && req.query.rank_id) {
            await database.delLiaisonCommandRankServer(res.locals.auth.id, req.session.serverInConfig, req.query.command_id, req.query.rank_id).catch(() => {});
        }

        res.redirect(req.header('Referer') || '/');
    });



    app.post('/addcommandes-grades', middlewares.isAuthentificated, async function(req, res) {
        await database.addLiaisonCommandRankServer(res.locals.auth.id, req.session.serverInConfig, req.body.commande, req.body.grade).catch(() => {});
        res.redirect(req.header('Referer') || '/');
    });



    /**
     * Comportements management
     */
    app.get('/comportements', middlewares.isAuthentificated, async function(req, res) {
        let servers = await database.getServers(res.locals.auth.id);
        let behaviors = await database.getBehaviorsServer(res.locals.auth.id, req.session.serverInConfig);

        let commandsRanks = await database.getLiaisonCommandRankServer(res.locals.auth.id, req.session.serverInConfig);

        res.render('comportements.ejs', {config: config, auth: res.locals.auth, page: 'comportements', servers: servers.rows, behaviors: behaviors.rows, commandsRanks: commandsRanks.rows, defaultServerId: req.session.serverInConfig});
    });



    app.post('/actionSaveComportements', middlewares.isAuthentificated, async function(req, res) {
        let behaviors = await database.getBehaviorsServer(res.locals.auth.id, req.session.serverInConfig);
        
        for(let i = 0; i < behaviors.rows.length; i++) {
            let value = false;
            if(req.body[behaviors.rows[i].name] == "on") {
                value = true;
            } else {
                value = false;
            }

            await database.setBehaviorServer(res.locals.auth.id, req.session.serverInConfig, behaviors.rows[i].name, value)
        
            console.log((await database.getBehaviorsServer(res.locals.auth.id, req.session.serverInConfig)).rows)
        }

        res.redirect(req.header('Referer') || '/');
    });



    /**
     * Log management
     */
    app.get('/logs', middlewares.isAuthentificated, async function(req, res) {
        let servers = await database.getServers(res.locals.auth.id);

        let serverInfos = await database.getServerInfos(res.locals.auth.id, req.session.serverInConfig);

        let channels = await discord.getDiscordChannels(config.BOT_TOKEN, req.session.serverInConfig);

        res.render('logs.ejs', {config: config, auth: res.locals.auth, page: 'logs', servers: servers.rows, serverInfos: serverInfos.rows, channels: channels, defaultServerId: req.session.serverInConfig});
    });

    
    
    app.post('/actionSaveLogs', middlewares.isAuthentificated, async function(req, res) {
        await database.setLogChannels(res.locals.auth.id, req.session.serverInConfig, req.body.channelLogIdMessages, req.body.channelLogIdCommandes)

        res.redirect(req.header('Referer') || '/');
    });
    
}
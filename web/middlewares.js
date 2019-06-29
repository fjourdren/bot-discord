const discord = require('./discord');

module.exports = {
    // vérifie si le joueur est connecté, si il ne l'est pas, alors on redirige
    isAuthentificated: async function(req, res, next) {
        if(req.session.access_token != null) {
            res.locals.auth = await discord.getDiscordIdentity(req.session.access_token);
        }

        if(req.session.access_token == null || res.locals.auth.code == 0) {
            res.redirect('/logout');
        } else {
            next();
        }
    },



    // vérifie si l'utilisateur est hors ligne
    isntAuthentificated: async function(req, res, next) {
        if(req.session.access_token != null) {
            res.locals.auth = await discord.getDiscordIdentity(req.session.access_token);
        }

        if(req.session.access_token == null || res.locals.auth.code == 0) {
            next();
        } else {
            res.redirect('/grades');
        }
    }
}
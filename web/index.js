var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use('/static', express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({
    secret: '343ji43j4efefef41fe4sf48n3jn4jfedk3n',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


require('./routes')(app);


/*app.use((err, req, res, next) => {
    switch (err.message) {
        case 'NoCodeProvided':
            return res.status(400).send({
                status: 'ERROR',
                error: err.message,
            });
        default:
            return res.status(500).send({
                status: 'ERROR',
                error: err.message,
            });
    }
});*/


app.listen(1337);
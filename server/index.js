require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSetter = require('./core/cookiesetter');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static('public'));
app.use(cookieSetter);
app.set('view engine', 'ejs');

// Lives
app.get('/live/:id', (req, res) => {
	res.cookie('liveId', req.params.id);
	res.render('game.ejs');
});

app.listen(process.env.PORT || 8080);
console.log('App started at port ' + (process.env.PORT || 8080));
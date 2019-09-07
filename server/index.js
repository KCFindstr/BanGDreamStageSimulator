require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSetter = require('./core/cookiesetter');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSetter);
app.set('view engine', 'ejs');

// Editor
app.get('/', (req, res) => {
	res.redirect('editor');
});
app.get('/editor', (req, res) => {
	res.render('editor/index.ejs');
});

// Lives
app.get('/live/:id', (req, res) => {
	res.cookie('liveId', req.params.id);
	res.render('game.ejs');
});

// Static
app.use('/', express.static('public'));

app.listen(process.env.PORT || 8080);
console.log('App started at port ' + (process.env.PORT || 8080));
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'));
app.set('view engine', 'ejs');

app.get('/live/:id', (req, res) => {
	res.render('game.ejs');
});

app.listen(process.env.PORT || 8080);
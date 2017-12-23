'use strict';

const token = require('./token');

const Telegram = require('telegram-node-bot'),
	tg = new Telegram.Telegram(token, {
		workers: 1, //controllare numero,
		webAdmin: {
			port: 7776,
			host: 'localhost'
	}
	});

// per comandi non riconosciuti/implementati
const OtherwiseController = require('./controllers/otherwiseController');

//per comandi validi
const PlayController = require('./controllers/playController');

// routing
tg.router
	.when(new Telegram.TextCommand('/play','play'), new PlayController())
    .when(new Telegram.RegexpCommand(/.+@CarloCingolatoBot/g, 'carlo'), new PlayController())
	.otherwise(new OtherwiseController());

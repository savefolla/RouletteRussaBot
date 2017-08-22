'use strict';

const Telegram = require('telegram-node-bot');

class PlayController extends Telegram.TelegramBaseController {
	playHandler($) {
		console.log($);
		console.log($.message.from.id + ' gioca...');
		const x = Math.floor(Math.random()*6);
		const y = Math.floor(Math.random()*6);
		console.log(x+' vs '+y);
		if(x == y){
			$.sendMessage($.message.from.username + ' è morto per fortuna');
			$.kickChatMember($.message.from.id).then(
				$.unbanChatMember($.message.from.id).then(
					console.log($.message.from.username+' ('+$.message.from.id+') è stato kickato e sbannato')
				)
			);
			
		}else{
			console.log($.message.from.username+' ('+$.message.from.id+') è sopravvissuto');
			$.sendMessage($.message.from.username + ' è sopravvissuto purtroppo');
		}
	}
	get routes() {
		return {
			'play': 'playHandler'
		};
	}
}

module.exports = PlayController;
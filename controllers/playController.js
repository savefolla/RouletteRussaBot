'use strict';

const Telegram = require('telegram-node-bot');

class PlayController extends Telegram.TelegramBaseController {
	playHandler($) {
		console.log($);
		console.log($.message.from.id + ' gioca...');
		const x = Math.floor(Math.random()*6);
		const y = Math.floor(Math.random()*6);
		console.log(x+' vs '+y);
		const wait = Math.floor(Math.random()*1000*60);
		console.log('aspetto '+wait+' millisecondi');
		$.sendMessage($.message.from.username + ' saprai il tuo destino fra '+Math.floor(wait/1000)+' secondi');
		setTimeout(() => {
			if(x == y){
				const time = Math.floor(Math.random()*1000*60);		
				$.sendMessage($.message.from.username + ' ti restano '+Math.floor(time/1000)+' secondi in questo gruppo. Spendili bene');
				setTimeout(() => {
					$.sendMessage($.message.from.username + ' è morto per fortuna');
					$.kickChatMember($.message.from.id).then(
						$.unbanChatMember($.message.from.id).then(
							console.log($.message.from.username+' ('+$.message.from.id+') è stato kickato e sbannato')
						)
					);
				}, time);					
			}else{
				console.log($.message.from.username+' ('+$.message.from.id+') è sopravvissuto');
				$.sendMessage($.message.from.username + ' è sopravvissuto purtroppo');
			}
		}, wait);		
	}
	get routes() {
		return {
			'play': 'playHandler'
		};
	}
}

module.exports = PlayController;
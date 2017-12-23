'use strict';

const Telegram = require('telegram-node-bot');
const abuseDb = require('../db/abuseDb.json');
const fs = require('fs');

class PlayController extends Telegram.TelegramBaseController {
    constructor() {
        super();
        this.usagesLimit = 10;
        this.timeWindow = 60; // in seconds
    }
    carloHandler($) {
        //if ($.message.chat.type === 'private') return
        this.userIndex = abuseDb.findIndex(user => user.id === $.message.from.id);
        if (this.userIndex === -1) {
            abuseDb.push({
                id: $.message.from.id,
                usages: []
            });
            this.userIndex = abuseDb.length - 1;
        }
        abuseDb[this.userIndex].usages.push($.message.date);
        this.deleteOldUsages();
        if (this.hasAbused()) {
            $.sendMessage($.message.from.username + ' hai abusato del bot di Carlo, giochiamo alla roulette');
            this.playHandler($);
        }
    }
    deleteOldUsages() {
        const now = Date.now()/1000;
        abuseDb[this.userIndex].usages = abuseDb[this.userIndex].usages.filter(usage => usage > now - this.timeWindow);
        fs.writeFile('db/abuseDb.json', JSON.stringify(abuseDb), function(err) {
            if(err) console.log(err);
            else console.log('updates usages');
        });
    }
    hasAbused() {
        return abuseDb[this.userIndex].usages.length >= this.usagesLimit;
    }
	playHandler($) {
		console.log($);
		console.log($.message.from.id + ' gioca...');
		const x = Math.floor(Math.random()*6);
		const y = Math.floor(Math.random()*6);
		console.log(x+' vs '+y);
		const wait = Math.floor(Math.random()*1000*10);
		console.log('aspetto '+wait+' millisecondi');
		$.sendMessage($.message.from.username + ' saprai il tuo destino fra '+Math.floor(wait/1000)+' secondi');
		setTimeout(() => {
			if(x == y){
				const time = Math.floor(Math.random()*1000*10);
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
			'play': 'playHandler',
			'carlo': 'carloHandler'
		};
	}
}

module.exports = PlayController;
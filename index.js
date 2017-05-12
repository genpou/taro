//console.log("HELLO");
var request = require('request'), cheerio = require('cheerio');
var fs = require('fs');
var utf8 = require('utf8');
var striptags = require('striptags');
var xpath = require('xpath')
, dom = require('xmldom').DOMParser;
var Regex = require("regex");

//Загружаем страницу
request({uri:'http://taro.org.ua/%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%BA%D0%B0/%D0%BA%D0%B0%D1%80%D1%82%D1%8B_%D1%82%D0%B0%D1%80%D0%BE.html', method:'GET', encoding:'binary'},
	function (err, res, page) {
        //Передаём страницу в cheerio
        var $=cheerio.load(page);
        //Идём по DOM-дереву обычными CSS-селекторами
       // var href=$('table > tbody > tr > td > a').attr("href");
       var hrefs=Array.from($('#nowrap table td a:first-child'));
       var href=[];
       var addr;
       var i=0;
       var card;
       var cards=[];
       var nowrap ;
       var csv_string;
       fs.writeFile("./test", "", function(err) {
       	if(err) {
       		return console.log(err);
       	}
       	console.log("The file was saved!");
       });
       fs.writeFile("./csv", "", function(err) {
       	if(err) {
       		return console.log(err);
       	}
       	console.log("The file was saved!");
       });	
       hrefs.forEach( function(element, index) {
       	if (i!=0){
	       		//console.log(element.attribs.href);
	       		//href.push('http://taro.org.ua'+element.attribs.href);
	       		addr='http://taro.org.ua'+element.attribs.href;
	       		request({uri:addr, method:'GET', encoding:'binary'},
	       			function (err, res, page) {
	       				if(page){
	       					$ = cheerio.load(page);
	       					nowrap = utf8.decode(striptags($('#nowrap').text()));
	       					
	       						// fs.writeFile("./test", "", function(err) {
							       // 	if(err) {
							       // 		return console.log(err);
							       // 	}
							       // 	console.log("СССС");
							       // });	


	       					//console.log('CH OK');
	       					card={};
	       					//card.name=utf8.decode($('#nowrap > h1 ').text());      					
		    					//console.log(card.first.description);
	    					var n= nowrap.match(/Расшифровка карты Таро(.*)/i);
	    					if (n){
	    						card.name=n[1];
	    						console.log(card.name);
	    					}else{
	    						card.name="";}
	    					card.first={};
	    					card.first.description=utf8.decode(striptags($('#nowrap > b:nth-child(15) > i').text())).replace(/\r|\n/g, '');

	    					
	    					var w = nowrap.match(/Работа, бизнес, дела:(.*)(?=Здоровье, самочувтвие:)/i);
	    					if (w){
	    						card.first.work=w[1];
	    					}else{
	    						card.first.work="";}

	    					var h = nowrap.match(/Здоровье, самочувтвие:(.*)(?=Отношения, вопросы о любви:)/i);
	    					if (h){
	    						card.first.health=h[1];
	    					}else{
	    						card.first.health="";}

	    					var l = nowrap.match(/Отношения, вопросы о любви:(.*)(?=Характеристика личности:)/i);
	    					if (l){
	    						card.first.love=l[1];
	    					}else{
	    						card.first.love="";}	
	    					
	    					var x = nowrap.match(/Характеристика личности:(.*)(?=Карта даёт ответ:)/i);
	    					if (x){
	    						card.first.char=x[1];
	    					}else{
	    						card.first.char="";}

	    					var a = nowrap.match(/Карта даёт ответ:(.*)(?=Совет, предупреждение:)/i);;
	    					if (a){
	    						card.first.ans=a[1];
	    					}else{
	    						card.first.ans="";}

	    					var ad = nowrap.match(/Совет, предупреждение:(.*)(\.)/i);
	    					//console.log(ad);
	    					if (ad){
	    						card.first.advice=ad[1];
	    					}else{
	    						card.first.advice="";}

	    					card.second={};

	    					w=h=l=x=a=ad='';
	    					var dsuk=$('#nowrap > b')[1];
	    					var wer = cheerio.load(dsuk);
	    					var huk = wer('i').text();
	    					console.log(huk);
	    					card.second.description=utf8.decode(striptags(huk)).replace(/\r|\n/g, '');

	    					// var d2 = nowrap.match(/Перевернутое положение картыОбщее значение(.*)(?=Работа, бизнес, дела:)/i);
	    					// if (d2){
	    					// 	card.second.description=d2[1];
	    					// }else{
	    					// 	card.second.description="";}
	    					// console.log(card.second.description);

							var w = nowrap.match(/Работа, бизнес, дела:(.*)(?=Здоровье, самочувтвие:)/i);
	    					if (w){
	    						card.second.work=w[1];
	    					}else{
	    						card.second.work="";}

	    					var h = nowrap.match(/Здоровье, самочувтвие:(.*)(?=Отношения, вопросы о любви:)/i);
	    					if (h){
	    						card.second.health=h[1];
	    					}else{
	    						card.second.health="";}

	    					var l = nowrap.match(/Отношения, вопросы о любви:(.*)(?=Характеристика личности:)/i);
	    					if (l){
	    						card.second.love=l[1];
	    					}else{
	    						card.second.love="";}	
	    					
	    					var x = nowrap.match(/Характеристика личности:(.*)(?=Карта даёт ответ:)/i);
	    					if (x){
	    						card.second.char=x[1];
	    					}else{
	    						card.second.char="";}

	    					var a = nowrap.match(/Карта даёт ответ:(.*)(?=Совет, предупреждение:)/i);
	    					if (a){
	    						card.second.ans=a[1];
	    					}else{
	    						card.second.ans="";}

	    					var ad = nowrap.match(/Совет, предупреждение:(.*)(\.)/i);
	    					//console.log(ad);
	    					if (ad){
	    						card.second.advice=ad[1];
	    					}else{
	    						card.second.advice="";}

	    					cards.push(card);
	    					fs.writeFile("./test", JSON.stringify(cards), function(err) {
	    						if(err) {
	    							//return console.log(err);
	    						}
	    						//console.log("The file was saved!");
	    					});
//ЗДЕСЬ""""№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№
	    					csv_string=  card.name + "|" +"<p><b>Общее значение:</b>" + card.first.description + "</p><p><b>Работа:</b>" +card.first.work+ "</p><p><b>Здоровье:</b>" +card.first.health+ "</p><p><b>Отношения:</b>" +card.first.love+ "</p><p><b>Характеристика личности:</b>" +card.first.char+ "</p><p><b>Карта дает ответ:</b>" +card.first.ans+"</p><p><b>Совет:</b>" +card.first.advice+ "</p>"+ "\n|" +"<p><b>Общее значение:</b>" + card.second.description + "</p><p><b>Работа:</b>" +card.second.work+ "</p><p><b>Здоровье:</b>" +card.second.health+ "</p><p><b>Отношения:</b>" +card.second.love+ "</p><p><b>Характеристика личности:</b>" +card.second.char+ "</p><p><b>Совет:</b>" +card.second.advice+ "</p>\n";
        					fs.appendFile("./csv", csv_string.replace(" \ "," "), function(err) {
									if(err) {
										//return console.log(err);
									}
									//console.log("CSV");
							});		    				
	    				}else{
	    					//console.log('CH err');
	    				}
	    			});
	       	}
	       	i++;
	       });
var qwe="qwe \n asdasd \r sadasd";

       	console.log(qwe.replace(/[^\\]/,"@@"));
        //console.log(href);`

    });

function getCart(name){

}

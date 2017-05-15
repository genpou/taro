console.log("HELLO");
var request = require('request'), cheerio = require('cheerio');
var fs = require('fs');
var utf8 = require('utf8');
var striptags = require('striptags');
var xpath = require('xpath')
, dom = require('xmldom').DOMParser;
var Regex = require("regex");

//Загружаем страницу
request({uri:'http://taro.org.ua/%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%BA%D0%B0/%D0%BA%D0%B0%D1%80%D1%82%D1%8B_%D0%BB%D0%B5%D0%BD%D0%BE%D1%80%D0%BC%D0%B0%D0%BD.html', method:'GET', encoding:'binary'},
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
       var errs=[];
       var er;
       fs.writeFile("./lenormand.json", "", function(err) {
       	if(err) {
       		return console.log(err);
       	}
       	//console.log("The JSON clean!");
       });
       fs.writeFile("./lenormand.csv", "", function(err) {
       	if(err) {
       		return console.log(err);
       	}
       	//console.log("The CSV clean!");
       });	
       hrefs.forEach( function(element, index) {
       	if (i!=0){
	       		//console.log(element.attribs.href);
            addr='http://taro.org.ua'+element.attribs.href;
            request({uri:addr, method:'GET', encoding:'binary'},
              function (err, res, page) {
                if(page){
                  $ = cheerio.load(page);
                  nowrap = utf8.decode(striptags($('#nowrap').text()));
                  card={};

                  var n= nowrap.match(/Расшифровка карты Ленорман(.*)/i);
                  if (n){
                    card.name=n[1];                    
                  }else{
                    card.name="";
                    console.log("card.name");
                  }

                  card.description=utf8.decode(striptags($('#nowrap > b:nth-child(13) > i').text())).replace(/\r|\n/g, '');

                  var w = nowrap.match(/Работа, бизнес, дела: (.*)(?=Здоровье, самочувтвие: )/i);
                  if (w){
                    card.work=w[1];
                  }else{
                    card.work="";
                    console.log('work');
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  w='';
                  var w = nowrap.match(/Здоровье, самочувтвие: (.*)(?=Отношения, вопросы о любви: )/i);
                  if (w){
                    card.health=w[1];
                  }else{
                    card.health="";
                    console.log('health');
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  w='';

                  var w = nowrap.match(/Отношения, вопросы о любви: (.*)(?=Характеристика личности: )/i);
                  if (w){
                    card.love=w[1];
                  }else{
                    card.love="";
                    console.log('love');
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  w='';
                  var w = nowrap.match(/Характеристика личности: (.*)(?=Совет: )/i);
                  if (w){
                    card.mind=w[1];
                  }else{
                    card.mind="";
                    console.log('mind');
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  w='';
                  var w = nowrap.match(/Совет: (.*)(?=Поделиться: )/i);
                  if (w){
                    card.ad=w[1];
                  }else{
                    card.ad="";
                    console.log('ad');
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  w='';
                  cards.push(card);
                  fs.writeFile("./lenormand.json", JSON.stringify(cards), function(err) {
                    if(err) {
                      return console.log(err);
                    }
                    //console.log("The JSON was saved!");
                  });
                  csv_string=  card.name + "|" 
                    + "<p><b>Общее значение:</b>" + card.description 
                    + "</p><p><b>Работа, бизнес, дела:</b>" +card.work
                    + "</p><p><b>Физическое состояние:</b>" +card.phis
                    + "</p><p><b>Совет:</b>" +card.ad
                    + "</p><p><b>Предупреждение:</b>" +card.pre
                    + "</p><p><b>Положительный аспект карты:</b>" +card.pol
                    + "</p><p><b>Отрицательный аспект карты:</b>" +card.otr
                    + "</p><p><b>Развитие ситуации в положительном значении:</b>" +card.sp
                    + "</p><p><b>Развитие ситуации в отрицательном значении:</b>" +card.op
                    + "</p>"+ "\n"; 
                    fs.appendFile("./lenormand.csv", csv_string.replace(" \ "," "), function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      //console.log("CSV");
                    });
                }
              });   		
	       	}
	       	i++;
	       });

    });


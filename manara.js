console.log("HELLO");
var request = require('request'), cheerio = require('cheerio');
var fs = require('fs');
var utf8 = require('utf8');
var striptags = require('striptags');
var xpath = require('xpath')
, dom = require('xmldom').DOMParser;
var Regex = require("regex");

//Загружаем страницу
request({uri:'http://taro.org.ua/%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%BA%D0%B0/%D0%BA%D0%B0%D1%80%D1%82%D1%8B_%D1%82%D0%B0%D1%80%D0%BE_%D0%BC%D0%B0%D0%BD%D0%B0%D1%80%D0%B0.html', method:'GET', encoding:'binary'},
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
       fs.writeFile("./manara.json", "", function(err) {
       	if(err) {
       		return console.log(err);
       	}
       	//console.log("The JSON clean!");
       });
       fs.writeFile("./manara.csv", "", function(err) {
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
                  var n= nowrap.match(/Расшифровка карты Таро(.*)/i);
                  if (n){
                    card.name=n[1];                    
                  }else{
                    card.name="";
                    console.log("card.name");
                  }
                  card.description=utf8.decode(striptags($('#nowrap > b:nth-child(12) > i').text())).replace(/\r|\n/g, '');

                  var w = nowrap.match(/Состояние: (.*)(?=Характеристика отношений, чувства: )/i);
                  if (w){
                    card.feelings=w[1];
                  }else{
                    card.feelings="";
                    console.log('feelings');
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  var f = nowrap.match(/Физическое состояние: (.*)(?=Совет:)/i);
                  if (f){
                    card.phis=f[1];
                  }else{
                    card.phis="";
                    console.log('phis');
                    errs.push(addr);
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  var a = nowrap.match(/Совет: (.*)(?=Предупреждение:)/i);
                  if (a){
                    card.ad=a[1];
                  }else{
                    card.ad="";
                    console.log('ad');
                    errs.push(addr);
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  var p = nowrap.match(/Предупреждение: (.*)(?=Положительный аспект карты:)/i);
                  if (p){
                    card.pre=p[1];
                  }else{
                    card.pre="";
                    console.log('pre');
                    errs.push(addr);
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  var pol = nowrap.match(/Положительный аспект карты: (.*)(?=Отрицательный аспект карты:)/i);
                  if (pol){
                    card.pol=pol[1];
                  }else{
                    card.pol="";
                    console.log('pol');
                    errs.push(addr);
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  var otr = nowrap.match(/Отрицательный аспект карты: (.*)(?=Развитие ситуации в положительном значении:)/i);
                  if (otr){
                    card.otr=otr[1];
                  }else{
                    card.otr="";
                    console.log('otr');
                    errs.push(addr);
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  var sp = nowrap.match(/Развитие ситуации в положительном значении: (.*)(?=Развитие ситуации в отрицательном значении:)/i);
                  if (sp){
                    card.sp=sp[1];
                  }else{
                    card.sp="";
                    console.log('sp');
                    errs.push(addr);
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  var op = nowrap.match(/Развитие ситуации в отрицательном значении: (.*)(?=Поделиться:)/i);
                  if (op){
                    card.op=op[1];
                  }else{
                    card.op="";
                    console.log('op');
                    errs.push(addr);
                    fs.appendFile("./errs.csv", addr+"\n", function(err) {
                      if(err) {
                        return console.log(err);
                      }
                      console.log("ERR");
                    });
                  }
                  cards.push(card);
                  fs.writeFile("./manara.json", JSON.stringify(cards), function(err) {
                    if(err) {
                      return console.log(err);
                    }
                    //console.log("The JSON was saved!");
                  });
                  csv_string=  card.name + "|" 
                    + "<p><b>Общее значение:</b>" + card.description 
                    + "</p><p><b>Состояние:</b>" +card.feelings
                    + "</p><p><b>Физическое состояние:</b>" +card.phis
                    + "</p><p><b>Совет:</b>" +card.ad
                    + "</p><p><b>Предупреждение:</b>" +card.pre
                    + "</p><p><b>Положительный аспект карты:</b>" +card.pol
                    + "</p><p><b>Отрицательный аспект карты:</b>" +card.otr
                    + "</p><p><b>Развитие ситуации в положительном значении:</b>" +card.sp
                    + "</p><p><b>Развитие ситуации в отрицательном значении:</b>" +card.op
                    + "</p>"+ "\n"; 
                    fs.appendFile("./manara.csv", csv_string.replace(" \ "," "), function(err) {
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


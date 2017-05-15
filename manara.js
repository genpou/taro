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
       fs.writeFile("./manara.json", "", function(err) {
       	if(err) {
       		return console.log(err);
       	}
       	console.log("The file was saved!");
       });
       fs.writeFile("./manara.csv", "", function(err) {
       	if(err) {
       		return console.log(err);
       	}
       	console.log("The file was saved!");
       });	
       hrefs.forEach( function(element, index) {
       	if (i!=0){
	       		console.log(element.attribs.href);
	       		
	       	}
	       	i++;
	       });
var qwe="qwe \n asdasd \r sadasd";
//
  //     	console.log(qwe.replace(/[^\\]/,"@@"));
        //console.log(href);`

    });


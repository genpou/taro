console.log("HELLO");
var request = require('request'), cheerio = require('cheerio');
var fs = require('fs');
var utf8 = require('utf8');
var striptags = require('striptags');
var xpath = require('xpath')
, dom = require('xmldom').DOMParser;
var Regex = require("regex");

//Загружаем страницу
request({uri:'http://1001goroskop.ru/gadanie/?taro-karta-dnja/go/#glav', method:'GET', encoding:'binary'},
	function (err, res, page) {
    
});



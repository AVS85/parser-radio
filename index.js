// *** метод ...
var request = require('request'); //не поддерживает win-1251
var needle = require('needle');

// *** модули для ...
var tress = require('tress');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

var URL = 'https://online-red.com/radio/index.html';
// var URL = 'https://online-red.com/radio/RUS-radio.html';
var results = [];

// `tress` последовательно вызывает наш обработчик для каждой ссылки в очереди
console.log(`



*********************************************`);

var q = tress(function(url, callback){

    //тут мы обрабатываем страницу с адресом url
    needle.get(url, function(err, res){
        if (err) throw err;
        // console.log(res);
        
        // ! **** ПАРСИНГ СТРАНИЦЫ ИЗ res.body
        // делаем results.push для данных о новости
        // делаем q.push для ссылок на обработку
        // парсим DOM
        // console.log(`typeof = ${typeof(res)}`);
        


        var $ = cheerio.load(res.body);

        var el = $('.playerjs-audio')
        //информация о радио
        if(el.length > 0){
            console.log(`Length = ${el.length}`);
            console.log(typeof(el));
            
            let link = el.next().html()
            let title = el.prev().text()

            console.log(link);
            
            // el.each(function(i, item) {
            //     console.log(item.attribs);
                
            // });

            results.push({
                // title: $('span.jsx-844015450').text(),
                // date: $('.b_infopost>.date').text(),
                href: link,
                title: title,
                // size: $('.jsx-844015450').text().length
            });

            (function(){
                require('fs').writeFileSync('./data.json', JSON.stringify(results, null, 4));
            })()

        } else console.log('НЕ НАЙДЕНО');


        // ! **** ЗАПОЛНЯЕМ МАССИВ ССЫЛОК ДЛЯ ОБХОДА
        let nextPage = $('table#table-15 tr td>a');
        console.log(`nextPage.count = ${nextPage.length}`);
        
        
        nextPage.each(function(i, item) {
            // не забываем привести относительный адрес ссылки к абсолютному
            q.push(resolve(URL, $(this).attr('href')));
            console.log(resolve(URL, $(this).attr('href')));
        });

        // ! **** вызываем callback в конце
        callback(); // зачем? :)
    });

}, 10); // запускаем 10 параллельных потоков

// эта функция выполнится, когда в очереди закончатся ссылки
q.drain = function(){
    require('fs').writeFileSync('./data.json', JSON.stringify(results, null, 4));
}


// добавляем в очередь ссылку на первую страницу списка
q.push(URL);


// var request = require("request"),
//     cheerio = require("cheerio"),
//     url = "http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=" + 02888;

// request(url, function (error, response, body) {
//     if (!error) {
//         var $ = cheerio.load(body),
//             temperature = $("[data-variable='temperature'] .wx-value").html();

//         console.log("Температура " + temperature + " градусов по Фаренгейту.");
//     } else {
//         console.log("Произошла ошибка: " + error);
//     }
// });
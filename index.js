// *** метод ...
var request = require('request'); //не поддерживает win-1251
var needle = require('needle');

// *** модули для ...
var tress = require('tress');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

var URL = 'https://online-red.com/radio/RUS-radio.html';
var results = [];

// `tress` последовательно вызывает наш обработчик для каждой ссылки в очереди
console.log(`
*********************************************
`);

var q = tress(function(url, callback){

    //тут мы обрабатываем страницу с адресом url
    needle.get(url, function(err, res){
        if (err) throw err;
        // console.log(res);
        
        // здесь делаем парсинг страницы из res.body
            // делаем results.push для данных о новости
            // делаем q.push для ссылок на обработку
            // парсим DOM
            var $ = cheerio.load(res.body);

            var el = $('.playerjs-audio')
            //информация о новости
            if(el.length > 0){
                
                let link = el.next().html()
                console.log(link);
                link = 'https://'

                // regexp = /^(http?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/gmi;
                regexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

                // regexp = /^(https?:\/\/)$/gmi

                let rest = link.match(regexp);
                console.log(rest);
                

                // for(let i of link){
                //     console.log(link[i] + ' j');
                // }
                // el.each(function(i, item) {
                //     let x = item.hasClass('fruit')
                //     console.log(x);
                    
                // });
                
                











                results.push({
                    // title: $('span.jsx-844015450').text(),
                    // date: $('.b_infopost>.date').text(),
                    href: url,
                    ggg: 3,
                    // size: $('.jsx-844015450').text().length
                });
            } else {
                console.log('НЕ НАЙДЕНО');
                
            }

            //список новостей
            // $('.b_rewiev p>a').each(function() {
            //     q.push($(this).attr('href'));
            // });

            //паджинатор
            // $('.bpr_next>a').each(function() {
            //     // не забываем привести относительный адрес ссылки к абсолютному
            //     q.push(resolve(URL, $(this).attr('href')));
            // });

        callback(); //вызываем callback в конце
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
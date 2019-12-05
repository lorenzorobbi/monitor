var express = require('express');
var app = express();

const http = require('http');
const https = require('https');

// Inizializzazione Porta Applicazione
var port = process.env.PORT || 8080;

// View Engine: EJS
app.set('view engine', 'ejs');
// set the path for all public resources (css/js/images)
app.use(express.static(__dirname + '/public'));

// Carica Home Page
app.get('/', function (req, res) {
    https.get('https://api.myjson.com/bins/lpefo', (resp) => {
        let data = '';
        var jsonArray = '';
        var i;
        var ct = 0;

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            // console.log(JSON.stringify(JSON.parse(data)));
            jsonArray = JSON.parse(data);
            // console.log(jsonArray);
            var progetti = new Array();
            var progetti = [];

            for (i in jsonArray) {
                ct++;
                // console.log("ct: " + ct + " - " + jsonArray[i].clienteCode + ' - ' + jsonArray[i].clienteDesc);
                progetti.push({
                    name: jsonArray[i].CardName,
                    nazione: jsonArray[i].Nazione,
                    nCommessa: jsonArray[i].nCommessa,
                    prcAcquisti: jsonArray[i].prcAcquisti,
                    prcProgettazione: jsonArray[i].prcProgettazione,
                    prcMontaggio: jsonArray[i].prcMontaggio,
                    prcProduzione: jsonArray[i].prcProduzione,
                    Scadenza: jsonArray[i].CreateDate,
                });
            }

            //Invio Dati A Pagina Home
            res.render('pages/home', {
                progetti: progetti,
            });

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

});
// pagina mappa
app.get('/mappa', function (req, res) {
    res.render('pages/mappa', {
        active: true
    });
});

// START THE SERVER ================
// =================================
app.listen(port);
console.log('Digitare "localhost:' + port + '" Su Chrome per visualizzare il programma');
if (process.pid) {
    console.log('Process pid ' + process.pid);
}






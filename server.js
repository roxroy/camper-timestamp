var express = require('express')
var path = require('path')
var url = require('url');

var app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug')
app.set('views','public')


var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

function formattedDate(now){
    return monthNames[now.getUTCMonth()] +' '+ 
        now.getUTCDate() +', ' +
        now.getUTCFullYear();
};

function convertDate(asDate,asNumber){
    var result = { unix : null,  natural : null }
    
    if (asNumber > 0) {
         result.unix = asNumber;
         result.natural = formattedDate(new Date(asNumber*1000));
    } else  if (!isNaN(asDate)) {
         result.natural = formattedDate(new Date(asDate));
         result.unix = asDate/1000;
    }
     
    return result;
};

app.get('/', function(req, res) {
    var now = new Date()
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var result = {unix: Math.floor(now/1000), natural : formattedDate(now), url: fullUrl }
    
    res.render('index', result )
})

app.get('/:timeString', function(req, res) {
     var dateString = req.params.timeString.trim();
     
     var asDate = Date.parse(dateString);
     var asNumber = Number(+dateString);
     
     var result = convertDate(asDate,asNumber);
     
     res.json(result)
})

app.listen(process.env.PORT || 3000)

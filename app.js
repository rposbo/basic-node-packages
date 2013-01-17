var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , proxy = require('./proxy')

var app = express()
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

var host = 'rposbo-basic-node-api.azurewebsites.net';

app.get('/products/:search/:key', function (req,response) {
console.log("Request handler 'products' was called");

  var requestPath = '/products/' + req.params.search + '?key=' + req.params.key;
    
  proxy.getRemoteData(host, requestPath, function(json){
    var data = JSON.parse(json);
    
    response.render('products',
        {
            title: 'Products for' + data.category,
            products: data.products,
            key: req.params.key
        }
    );
  })
});


app.get('/product/:id/:key', function (req,response) {
console.log("Request handler 'product' was called");

  var requestPath = '/product/' + req.params.id + '?key=' + req.params.key;
    
  proxy.getRemoteData(host, requestPath, function(json){
    var data = JSON.parse(json);
    
    response.render('product',
        {
            title: data.title,
            product: data
        }
    );
  })
});


app.get('/', function (req,response) {
    console.log("Request handler 'index' was called");
    response.end("Go");
});

app.listen(process.env.PORT);

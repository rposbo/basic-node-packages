var http = require('http');

function getRemoteData(host, requestPath, callback){
  
    var options = {
        host: host,
        port: 80,
        path: requestPath
    };
 
    var buffer = '';
    var request = http.get(options, function(result){
        result.setEncoding('utf8');

        result.on('data', function(chunk){
            buffer += chunk;
        });

        result.on('end', function(){
            callback(buffer);
        });
    });

    request.on('error', function(e){console.log('error from proxy call: ' + e.message)});
    request.end();
};
exports.getRemoteData = getRemoteData;
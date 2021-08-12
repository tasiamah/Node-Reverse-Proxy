//previous commands
const express = require("express");
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send(`The server is running..`)
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));

var url = require('url'),
    http = require('http'),
    acceptor = http.createServer().listen(3128);

acceptor.on('request', function (request, response) {
    console.log('request ' + request.url);
    request.pause();
    var options = url.parse(request.url);
    options.headers = request.headers;
    options.method = request.method;
    options.agent = false;

    var connector = http.request(options, function (serverResponse) {
        serverResponse.pause();
        response.writeHeader(serverResponse.statusCode, serverResponse.headers);
        serverResponse.pipe(response);
        serverResponse.resume();
    });
    request.pipe(connector);
    request.resume();
});

// Create web server
// Create a web server that listens on port 3000.
// When a GET request is made to the path /comments, the server should read the contents of the comments.json file and return the contents as a JSON response.
// When a POST request is made to the path /comments, the server should read the contents of the comments.json file, add the data in the request body to the comments list, and then write the comments list back to the comments.json file. The server should then return a JSON response with the updated comments list.

var fs = require('fs');
var http = require('http');
var url = require('url');

var server = http.createServer(function(req, res) {
    var urlParts = url.parse(req.url);
    if (req.method === 'GET' && urlParts.pathname === '/comments') {
        fs.readFile('comments.json', 'utf8', function(err, data) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end();
                return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        });
    } else if (req.method === 'POST' && urlParts.pathname === '/comments') {
        var comments = [];
        req.on('data', function(data) {
            comments.push(data);
        });

        req.on('end', function() {
            fs.readFile('comments.json', 'utf8', function(err, data) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end();
                    return;
                }

                var commentsList = JSON.parse(data);
                commentsList.push(JSON.parse(comments));
                fs.writeFile('comments.json', JSON.stringify(commentsList), function(err) {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.end();
                        return;
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(commentsList));
                });
            });
        });
    } else {
        res.statusCode = 404;
        res.end();
    }
});

server.listen(3000);
// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const comments = require('./comments.json');

const server = http.createServer((req, res) => {
    // get the url
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // if the url is /comments
    if (pathname === '/comments') {
        // if the method is GET
        if (req.method === 'GET') {
            // set the response header
            res.setHeader('Content-Type', 'application/json');
            // send the comments
            res.end(JSON.stringify(comments));
        }
        // if the method is POST
        else if (req.method === 'POST') {
            // read the request body
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                // parse the body
                const comment = JSON.parse(body);
                // add the new comment
                comments.push(comment);
                // save the comments
                fs.writeFileSync(path.join(__dirname, 'comments.json'), JSON.stringify(comments));
                // send the response
                res.end(JSON.stringify(comment));
            });
        }
    }
    // if the url is not /comments
    else {
        // read the file
        fs.readFile(path.join(__dirname, pathname), 'utf-8', (err, data) => {
            // if the file is not found
            if (err) {
                // set the response header
                res.setHeader('Content-Type', 'text/plain');
                // set the status code to 404
                res.statusCode = 404;
                // send the response
                res.end('Not Found');
            }
            // if the file is found
            else {
                // set the response header
                res.setHeader('Content-Type', 'text/html');
                // send the response
                res.end(data);
            }
        });
    }
});

// listen to the port 3000
server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
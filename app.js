const http = require('http');
const router = require('./route');

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.on('error', (err) => {
        let error = {
            error: err.name,
            message: err.message
        }
        res.end(JSON.stringify(error));
    })

    try {
        await router(req, res);
        res.end();
    } catch (err) {
        res.writeHead(err.statusCode || 500);
        let error = {
            name: err.name,
            message: err.message,
            error: err.stack
        }
        res.end(JSON.stringify(error));
    }
});

server.on('error', (err) => {
    console.log('errrrrrrrrr');
})

server.listen(process.env.PORT || 3000);


server.on('listening', () => {
    console.log('Listening on port 3000');
})

module.exports = server;
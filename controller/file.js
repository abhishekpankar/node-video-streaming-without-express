const fs = require('fs');

module.exports = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            switch (req.query.stream) {
                case 'true':
                    let chunks = [];

                    fs.stat('./file.mp4', function (err, stats) {

                        if (err) {
                            return reject('file not found')
                        }
                        var range = req.headers.range;

                        let positions = [];
                        let total = stats.size;

                        if (!range) {
                            positions[0] = 0;
                        } else {
                            positions = range.replace(/bytes=/, "").split("-");
                            positions = positions.map(item => parseInt(item || total -1));
                        }
                        
                        let start = parseInt(positions[0], 10);
                        let end = positions[1] ? parseInt(positions[1], 10) : total - 1;;
                        let chunksize = (end - start) + 1;
                        
                        let fileStream = fs.createReadStream('./file.mp4', {
                            highWaterMark: 16*1024,
                            start: start,
                            end: end,
                            autoClose: true
                        });
                        res.writeHead(206, {
                            "Content-Range": "bytes " + start + "-" + end + "/" + total,
                            "Accept-Ranges": "bytes",
                            "Content-Length": chunksize,
                            'Content-Type': 'video/mp4'
                        });
                        
                        fileStream.once('error', (err) => {
                            return reject('Something went wrong when reading the file');
                        });
        
                        fileStream.on('data', (chunk) => {
                            chunks.push(chunk);
                        });
                        
                        fileStream.pipe(res, {
                            end: true
                        });
                        
                        fileStream.on('end', () => {
                            console.log('Streaming Done')
                            res.write(Buffer.concat(chunks));
                            res.end()
                        })
                    })
                    break;
            
                default:
                    res.setHeader('Content-Type', 'video/mp4');
                    fs.readFile('./file2.mp4', {}, (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        res.write(data);
                        res.end(data);
                    })
                    break;
            }
        } catch (error) {
            return reject(error.message);
        }
    })
}
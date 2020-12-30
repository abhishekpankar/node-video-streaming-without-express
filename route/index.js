module.exports = async (req, res) => {
    try {
        let params = req.url.split('?');
        paramsData = params[1] ? params[1].split('&') : [];
        req['query'] = {};
        paramsData.forEach(item => {
            req.query[item.split('=')[0]] = item.split('=')[1];
        });
        switch (params[0]) {
            case '/':
                require('../controller/helloworld')(req, res);
                break;

            case '/test':
                await require('../controller/file')(req, res);
                break;
        
            default:
                let err = new Error('Not Found');
                err.statusCode = 404;
                throw err;
        }
    } catch (err) {
        throw err;
    }
};
module.exports = (req, res) => {
    res.end(JSON.stringify({'hello': 'world'}));
}
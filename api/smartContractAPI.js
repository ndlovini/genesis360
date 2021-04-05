const apiPath = "/smartContract/api"

function routes(app, contract) {
    app.use(function timeLog (req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });
    
    app.get(apiPath + '/', function (req, res) {
        res.send("Smart Contract API");
    });
    
    app.get(apiPath + '/tasks', function (req, res) {
        res.send("these are the tasks");
    });
    
    app.get(apiPath + '/taskItems', function (req, res) {
        res.send("these are the task items");
    });
    
    app.get(apiPath + '/suppliers', function (req, res) {
        res.send("these are the suppliers");
    });
    
    app.get(apiPath + '/locations', function (req, res) {
        res.send("these are the locations");
    });
    
    app.post(apiPath + '/tasks', function (req, res) {
        res.send('Got a POST request at /tasks');
    });
    
    app.post(apiPath + '/taskItems', function (req, res) {
        res.send('Got a POST request at /taskItems');
    });
    
    app.post(apiPath + '/suppliers', function (req, res) {
        res.send('Got a POST request at /suppliers');
    });
    
    app.post(apiPath + '/locations', function (req, res) {
        res.send('Got a POST request at /locations');
    });
    
    app.put(apiPath + '/tasks', function (req, res) {
        res.send('Got a PUT request at /tasks');
    });
    
    app.put(apiPath + '/locations', function (req, res) {
        res.send('Got a PUT request at /locations');
    });
    
    app.put(apiPath + '/suppliers', function (req, res) {
        res.send('Got a PUT request at /suppliers');
    });
    
    app.delete(apiPath + '/tasks', function (req, res) {
        res.send('Got a DELETE request at /tasks');
    });
    
    app.delete(apiPath + '/taskItems', function (req, res) {
        res.send('Got a DELETE request at /taskItems');
    });
    app.delete(apiPath + '/suppliers', function (req, res) {
        res.send('Got a DELETE request at /suppliers');
    });
    app.delete(apiPath + '/locations', function (req, res) {
        res.send('Got a DELETE request at /locations');
    });
}

module.exports = routes;
const apiPath = "/smartContract/api"

function routes(app, contract, accounts) {
    app.use(function timeLog (req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });
    
    app.get(apiPath + '/', function (req, res) {
        res.send("Smart Contract API");
    });
    
    app.get(apiPath + '/tasks', function (req, res) {
        var tasks = [];
        contract.taskCount()
        .then (count => {
            count = count.toNumber();
            for (var x = 1; x <= count; x++) {
                contract.tasks(x, (err, task) => {
                    tasks.push(task);
                    if (tasks.length === count)
                        res.send(tasks);
                })
            }
        });
    });
    
    app.get(apiPath + '/taskItems', function (req, res) {
        var items = [];
        contract.itemCount()
        .then (count => {
            count = count.toNumber();
            for (var x = 1; x <= count; x++) {
                contract.items(x, (err, item) => {
                    items.push(item);
                    if (items.length === count)
                        res.send(items);
                })
            }
        });
    });
    
    app.get(apiPath + '/suppliers', function (req, res) {
        var suppliers = [];
        contract.supplierCount()
        .then (count => {
            count = count.toNumber();
            for (var x = 1; x <= count; x++) {
                contract.suppliers(x, (err, supplier) => {
                    suppliers.push(supplier);
                    if (suppliers.length === count)
                        res.send(suppliers);
                })
            }
        });
    });
    
    app.get(apiPath + '/locations', function (req, res) {
        var locations = [];
        contract.locationCount()
        .then (count => {
            count = count.toNumber();
            for (var x = 1; x <= count; x++) {
                contract.locations(x, (err, location) => {
                    locations.push(location);
                    if (locations.length === count)
                        res.send(locations);
                })
            }
        });
    });
    
    // Create a new task on the blockchain
    app.post(apiPath + '/tasks', function (req, res) {
        if (typeof req.body.deliveryDate != "number" || 
            typeof req.body.locationId != "number" || 
            typeof req.body.supplierId != "number" || 
            typeof req.body.taskStatus!= "number") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }

        if (Object.keys(req.body).length != 4) {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }
        
        contract.CreateTask(
            req.body.deliveryDate, 
            req.body.locationId, 
            req.body.supplierId, 
            req.body.taskStatus, 
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });
    
    // Create a new task item on the blockchain
    app.post(apiPath + '/taskItems', function (req, res) {
        if (typeof req.body.itemName != "string" || 
            typeof req.body.quantity != "string" || 
            typeof req.body.uom != "string" || 
            typeof req.body.sourceName!= "string" || 
            typeof req.body.taskId!= "number") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }

        if (Object.keys(req.body).length != 5) {
            res.status(400).json({ error: 'malformed payload'});
            return
        } 

        contract.CreateItem(
            req.body.itemName, 
            req.body.quantity, 
            req.body.uom, 
            req.body.sourceName,
            req.body.taskId, 
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });
    
    // Create a new supplier on the blockchain
    app.post(apiPath + '/suppliers', function (req, res) {
        if (typeof req.body.supplierName != "string" || 
            typeof req.body.supplierRegion != "number") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }

        if (Object.keys(req.body).length != 2) {
            res.status(400).json({ error: 'malformed payload'});
            return
        } 

        contract.CreateSupplier(
            req.body.supplierName, 
            req.body.supplierRegion, 
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });
    
    // Create a new location on the blockchain
    app.post(apiPath + '/locations', function (req, res) {
        if (typeof req.body.address != "string" || 
            typeof req.body.description != "string") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }

        if (Object.keys(req.body).length != 2) {
            res.status(400).json({ error: 'malformed payload'});
            return
        } 

        contract.CreateItem(
            req.body.address, 
            req.body.description,
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
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
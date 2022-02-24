const apiPath = "/smartContract/api"

function routes(app, contract, accounts) {
    app.use(function timeLog (req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });
    
    app.get(apiPath + '/', function (req, res) {
        res.send("Smart Contract API");
    });
    
    // Read tasks data from the blockchain
    app.get(apiPath + '/tasks', function (req, res) {
        var tasks = [];
        contract.taskCount()
        .then (count => {
            count = count.toNumber();
            for (var x = 0; x <= count; x++) {
                contract.tasks(x, (err, task) => {
                    tasks.push(task);
                    if (tasks.length === count)
                        res.send(tasks);
                })
            }
            if (count == 0)
                res.send([]);
        });
    });
    
    // Read items per task data from the blockchain
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
    
    // Read supplier data from the blockchain
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
    
    // Read locations data from the blockchain
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
        if (typeof req.body.deliveryDate != "string" || 
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
        
        // convert datetime to timestamp in seconds for solidity.
        let dateTimestamp = Math.round(new Date(req.body.deliveryDate).getTime()/1000);
        
        contract.CreateTask(
            dateTimestamp, 
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

        contract.CreateLocation(
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
    
    // Update task status on the blockchain
    app.put(apiPath + '/task/:taskId', function (req, res) {
        let taskId = req.params.taskId;
        let taskStatus = req.body.taskStatus;

        if (typeof taskId != "string" ||
            typeof taskStatus != "number") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }
        
        contract.UpdateTaskStatus( 
            taskStatus,
            taskId,
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });

    // Update task complete flag to completed on the blockchain
    app.put(apiPath + '/completeTask/:taskId', function (req, res) {
        let taskId = req.params.taskId;

        if (typeof taskId != "string") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }
        
        contract.UpdateTaskCompletionStatus(
            1,
            taskId, 
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' });
        });
    });
    
    // Update location data on the blockchain
    app.put(apiPath + '/location/:locationId', function (req, res) {
        let locationId = req.params.locationId;
        let locationAddress = req.body.locationAddress;

        if (typeof locationId != "string" || 
            typeof locationAddress != "string") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }
        
        contract.UpdateLocationAddress(
            locationAddress,
            locationId, 
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });
    
    // Update supplier score on the blockchain
    app.put(apiPath + '/supplierScore/:supplierId', function (req, res) {
        let supplierId = req.params.supplierId;
        let score = req.body.score;

        if (typeof supplierId != "string" || 
            typeof score != "number") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }
        
        contract.UpdateSupplierScore(
            score,
            supplierId,
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });

    // Update supplier name on the blockchain
    app.put(apiPath + '/supplierName/:supplierId', function (req, res) {
        let supplierId = req.params.supplierId;
        let name = req.body.supplierName;

        if (typeof supplierId != "string" || 
            typeof name != "string") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }
        
        contract.UpdateSupplierName(
            name,
            supplierId,
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });
    
    // Mark task as deleted on the blockchain
    app.delete(apiPath + '/task/:taskId', function (req, res) {
        let taskId = req.params.taskId;

        if (typeof taskId != "string") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }
        
        contract.DeleteTask(
            taskId,  
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });
    
    // Mark item as deleted on the blockchain
    app.delete(apiPath + '/taskItem/:itemId', function (req, res) {
        let itemId = req.params.itemId;

        if (typeof itemId != "string") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }
        
        contract.DeleteItem(
            itemId,  
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });

    // Mark supplier as deleted on the blockchain
    app.delete(apiPath + '/supplier/:supplierId', function (req, res) {
        let supplierId = req.params.supplierId;

        if (typeof supplierId != "string") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }
        
        contract.DeleteSupplier(
            supplierId,  
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });

    // Mark location as deleted on the blockchain
    app.delete(apiPath + '/location/:locationId', function (req, res) {
        let locationId = req.params.locationId;

        if (typeof locationId != "string") {
            res.status(400).json({ error: 'malformed payload'});
            return;
        }
        
        contract.DeleteLocation(
            locationId,  
            {from: accounts[0]})
        .then( response => {
            if (response)
                res.send("success");
            else
                res.status(500).json({ error: 'message' })
        });
    });
}

module.exports = routes;
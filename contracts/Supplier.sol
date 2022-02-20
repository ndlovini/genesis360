pragma solidity ^0.5.0;

contract Supplier {
    uint public taskCount = 0;
    uint public itemCount = 0;
    uint public locationCount = 0;
    uint public supplierCount = 0;


    enum taskStatus {
        Initial,
        InProgress,
        EnRoute
    }

    enum region {
        GP,
        KZN,
        EC,
        WC,
        NC,
        LP,
        FS,
        NW,
        MP
    }

    struct Item {
        uint id;
        string item;
        string quantity;
        string uom;
        string source;
        uint taskId;
        bool isDeleted;
    }

    struct Location {
        uint id;
        string deliveryAddress;
        string description;
        bool isDeleted;
    }

    struct Supplier {
        uint id;
        string name;
        region supplierRegion;
        uint score;
        bool isDeleted;
    }

    struct Task {
        uint id;
        uint deliveryDate;
        uint locationId;
        uint supplierId;
        bool completed;
        taskStatus status;
        bool isDeleted;
    }

    mapping(uint => Item) public items;
    mapping(uint => Task) public tasks;
    mapping(uint => Location) public locations;
    mapping(uint => Supplier) public suppliers;

    // #region Create entity entries
    function CreateItem (string memory _item, string memory _quantity, string memory _uom, string memory _source, uint _taskId) public {
        items[itemCount] = Item(itemCount, _item, _quantity, _uom, _source, _taskId, false); 
        itemCount++;
    }

    function CreateTask (uint _deliveryDate, uint _locationId, uint _supplierId, taskStatus _status) public {
        tasks[taskCount] = Task(taskCount, _deliveryDate, _locationId, _supplierId, false, _status, false);
        taskCount++;
    }

    function CreateLocation (string memory _address, string memory _description) public {
        locations[locationCount] = Location(locationCount, _address, _description, false);
        locationCount++;
    }

    function CreateSupplier (string memory _name, region _region) public {
        suppliers[supplierCount] = Supplier(supplierCount, _name, _region, 3, false);
        supplierCount++;
    }
    // #endregion

    // #region Update entity entries
    function UpdateTaskStatus (taskStatus _status, uint _taskId) public {
        Task storage task = tasks[_taskId];
        task.status = _status;
    }

    function UpdateTaskCompletionStatus (bool _completed, uint _taskId) public {
        Task storage task = tasks[_taskId];
        task.completed = _completed;
    }

    function UpdateLocationAddress (string memory _address, uint _locationId) public {
        Location storage location = locations[_locationId];
        location.deliveryAddress = _address;
    }

    function UpdateSupplierScore (uint _score, uint _supplierId) public {
        Supplier storage supplier = suppliers[_supplierId];
        supplier.score = _score;
    }

    function UpdateSupplierName (string memory _name, uint _supplierId) public {
        Supplier storage supplier = suppliers[_supplierId];
        supplier.name = _name;
    }
    // #endregion

    // #region Delete entity entries
    function DeleteTask(uint _taskId) public {
        Task storage task = tasks[_taskId];
        task.isDeleted = true;
    }

    function DeleteItem(uint _itemId) public {
        Item storage item = items[_itemId];
        item.isDeleted = true;
    }

    function DeleteLocation(uint _locationId) public {
        Location storage location = locations[_locationId];
        location.isDeleted = true;
    }

    function DeleteSupplier(uint _supplierId) public {
        Supplier storage supplier = suppliers[_supplierId];
        supplier.isDeleted = true;
    }
    // #endregion

    /*function GetLocationByName(string memory _locationName) public {
        for (int x = 0; x < locations.length(); x++) {
            if (locations[x].name == _locationName)
                return locations[x];
        }
        return false;
    }*/
}
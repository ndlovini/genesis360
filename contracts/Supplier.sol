pragma solidity ^0.5.0;

contract Supplier {
    uint public taskCount = 0;
    uint public itemCount = 0;


    struct Item {
        uint id;
        string item;
        string quantity;
        string uom;
        uint taskId;
    }

    struct Location {
        string deliveryAddress;
        string name;
    }

    struct Task {
        uint id;
        string deliveryDate;
        string deliveryAddress;
        string locationName;
        string Supplier;
        bool completed;
    }

    mapping(uint => Item) public items;
    mapping(uint => Task) public tasks;

    function CreateItem (string memory _item, string memory _quantity, string memory _uom) public {
        itemCount++;
        items[itemCount] = Item(itemCount, _item, _quantity, _uom, taskCount); 
    }

    function CreateTask (string memory _deliveryDate, string memory _address, string memory _locationName, string memory _supplierName) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _deliveryDate, _address, _locationName, _supplierName, false);
    }
}
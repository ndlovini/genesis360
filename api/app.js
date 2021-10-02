const express = require('express');
const app = express();
const smartContractRouter = require('./smartContractAPI');
const Web3 = require('web3');
const contract = require('@truffle/contract');
const artifacts = require('./../build/contracts/Supplier.json');

app.use(express.json());
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const supplierContract = contract(artifacts);
supplierContract.setProvider(web3.currentProvider);

async function loadContract() {
    const accounts = await web3.eth.getAccounts();
    var contractInstance = await supplierContract.deployed();
    smartContractRouter(app, contractInstance, accounts);

    app.listen(process.env.PORT || 8082, () => {
        console.log('listening on port 8082');
    });
}

loadContract();


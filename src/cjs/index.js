'use strict';

var ethers = require('ethers');

/**
     * @description Either returns the abi or the reason why it could not
     * @param {string} address Contract address
     * @param {string} etherscan_key A valid  Etherscan.io api key
     * @returns {string}
     */

const getAbi = async (address, etherscan_key) => {  
    const fetched = await fetch(`https://api.etherscan.io/api?${new URLSearchParams({ module: 'contract', action: 'getabi', address: address, apikey: etherscan_key })}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }});
    const formatted = await fetched.json();
    return formatted.result;
};

    /**
     * @description Builds the contract if possible otherwise returns null;
     * @param {string} address Contract address
     * @param {string} etherscan_key A valid Etherscan.io api key
     * @constructs Contract
     * @returns {Contract, null}
     */

const buildContract = (address, etherscan_key) => {
    return new Promise(async (resolve, reject) => {
        if(!address) reject('No addres provided to initiate contract build with');
        const abi = await getAbi(address, etherscan_key);
            if(abi === 'Max rate limit reached') reject(abi);
            else if(abi === 'Contract source code not verified') reject(abi);

        const contract = new ethers.Contract(address, abi);

        if(!contract instanceof ethers.Contract) reject('Contract class failed. Please report to the developer along with the contract address you tried to use.');
        const parsed_contract = await parsePuts(contract, abi);

        resolve(parsed_contract);
    });
};

    /**
     * @description Destructures ABI and creates arrays to be used in decoding for each readable function
     * @param {Contract} contract 
     * @param {string} abi 
     * @returns {Contract}
     */

const parsePuts = async (contract, abi) => {

    if(!contract || !contract instanceof ethers.Contract) throw new Error(`parsePuts cannot be called without a proper ethers/contract instance`);
    
        if(!abi) throw new Error(`parsePuts cannot be called without an ABI to parse. Please ensure it is of type string and that it is present.`);
            abi = await JSON.parse(abi);
    const commands = {};

    for(const thing of abi) {
        if(thing.type !== 'function') continue;
            else {
                commands[thing.name] = {
                    inputs: thing.inputs.map(input => input.type),
                    outputs: thing.outputs.map(output => output.type),
                };
            }    }
    contract.commands = commands;

    return contract;
};

    /**
     * @description A quick shortcut to connect all types singular to their respective decoded input
     * @param {Array<string>} types 
     * @param {Array<Result>} inputs 
     * @returns {Object<string, Array<string>>}
     */

const beautify = (types, inputs) => {

    if(!types || !inputs) throw new Error(`Missing arguments for beautify function.`);

        if(typeof types === 'string') types = [ types ];
            else if(!Array.isArray(types)) throw new Error(`Types passed must be either an array of types or a string`);
    
        if(!Array.isArray(inputs)) throw new Error('Inputs on beautify is expected to be an array of results');

    const input = {};

        for(let i=0;i < types.length; i++) {
            const type = types[i];
            input[type] = inputs[i];
        }

    return input;
};

    /**
     * Preferably used with TransactionResponse rather than a new Transaction instance
     * Attempts to parse the transaction and link types with their respective inputs decoded
     * If it cannot parse the transaction this is due to the ABI is missing functions that are being used on the network.
     * In the LITE version there is at the moment no available workaround. You can attempt to figure out which function is missing and add this to the abi to the contract you are creating.
     * @param {Contract} contract 
     * @param {TransactionResponse} transaction 
     * @returns {TransactionResponse, null}
     */

const parseTransaction = (contract, transaction) => {

    if(!contract || !contract instanceof ethers.Contract) throw new Error(`Contract passed to parseTransactions must be an instance of ethers/contract`);

        if(!transaction || (!transaction instanceof ethers.Transaction && !transaction instanceof ethers.TransactionResponse) === true) throw new Error(`Transaction must be passed and you must ensure it i`)

        if(!transaction.data || transaction.data === '0x') throw new Error(`Transaction data not present to parse. Only a proper data byte string can be used`);

    const parsed_transaction = contract.interface.parseTransaction({ data: transaction.data });

    if(parsed_transaction === null) return null;
    else {
        transaction.signature = parsed_transaction.signature;
        transaction.decoded_input = beautify(contract.commands[parsed_transaction.name].inputs, parsed_transaction.args);

        return transaction;
    }
};

exports.beautify = beautify;
exports.buildContract = buildContract;
exports.getAbi = getAbi;
exports.parsePuts = parsePuts;
exports.parseTransaction = parseTransaction;

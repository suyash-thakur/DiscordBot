const chalk = require('chalk');
const dictionary = require('./util/dictionary.json');

const { Worker, isMainThread, parentPort, workerData  } = require('worker_threads');

var cors = require('cors');
require("dotenv").config();
hashTable = {};

console.log(chalk.red.bold(workerData.message));
Object.keys(dictionary).forEach(item => {
    hashTable[item] =  dictionary[item];
});
parentPort.postMessage(hashTable[workerData.message]);


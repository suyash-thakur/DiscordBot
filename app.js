const express = require("express"),
    
bodyParser = require("body-parser");
require("dotenv").config();
const { Worker, isMainThread, parentPort } = require('worker_threads');
const chalk = require('chalk');
const app = express();
var cors = require('cors');
require("dotenv").config();
const http = require('http').Server(app);
const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

if (isMainThread) {
    const max = 1e7;
    const threadCount = +process.argv[2] || 2;
    const threads = new Set();;
    console.log(`Running with ${threadCount} threads...`);
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });
    for (let i = 0; i < threadCount - 1; i++) {
        threads.add(new Worker('./worker.js', { workerData: { message: 'zebra' }}));
    }
    for (let worker of threads) {
        worker.on('error', (err) => { throw err; });
        worker.on('exit', () => {
          threads.delete(worker);
          console.log(`Thread exiting, ${threads.size} running...`);
          if (threads.size === 0) {
            console.log("No Process Running");
          }
        })
        worker.on('message', (msg) => {
            console.log(chalk.cyanBright.bold(msg));
        });
      }
}
client.on('message', msg => {
    if (msg.content === 'ping' && msg.channel.id === '827619928235442259') {
      msg.reply('pong');
    }
});

http.listen(process.env.PORT || 3000, function () {
    console.log('Server listening on port 3000.');
});
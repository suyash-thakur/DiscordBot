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
const threadCount = +process.argv[2] || 2;
const threads = new Set();
const rp = require('request-promise');
const cheerio = require('cheerio');
var querystring = require('querystring');
const baseURL = 'https://www.google.com/search?q=';
client.login(process.env.BOT_TOKEN);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

if (isMainThread) {
  const max = 1e7;

  console.log(`Running with ${threadCount} threads...`);
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    for (let i = 0; i < threadCount - 1; i++) {
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
  
        client.channels.cache.get("827619928235442259").send(msg.slice(0, 50));
      });
    }
  });
  
}
client.on('message', msg => {
    if (msg.content === 'ping' && msg.channel.id === '827619928235442259') {
      msg.reply('pong');
  }
  if (msg.content.split(" ")[0] == '!search') {
    threads.add(new Worker('./worker.js', { workerData: { message: msg.content.split(" ")[1] }}));
    msg.reply('searching...');

  }
  if (msg.content.split(" ")[0] == '!google') {
    var url = baseURL + msg.content.split(" ")[1];
    var linkSel = 'h3.r a'
var descSel = 'div.s'
var itemSel = 'div.g'
var nextSel = 'td.b a span'
    rp(url).then(function (html) {

      var $ = cheerio.load(html)
      var res = {
        links: [],
        $: $,
      }

      $(itemSel).each(function (i, elem) {
        var linkElem = $(elem).find(linkSel)
        var descElem = $(elem).find(descSel)
        var item = {
          title: $(linkElem).first().text(),
          link: null,
          description: null,
          href: null
        }
        var qsObj = querystring.parse($(linkElem).attr('href'))

        if (qsObj['/url?q']) {
          item.link = qsObj['/url?q']
          item.href = item.link
        }

        $(descElem).find('div').remove()
        item.description = $(descElem).text()

        res.links.push(item);
        console.log(res);
      });
      console.log(res);

    }).catch(function (err) {
      console.log(err);
    msg.reply('Error Finding Search Result');

  });
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
      var sendMsg = msg;

      client.channels.cache.get("827619928235442259").send(sendMsg.slice(0, 1000) + "...");
    });
  }
});

http.listen(process.env.PORT || 3000, function () {
    console.log('Server listening on port 3000.');
});
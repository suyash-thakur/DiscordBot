const express = require("express"),
bodyParser = require("body-parser");

const app = express();
var cors = require('cors');
const http = require('http').Server(app);
const discord = require('./routes/discord');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/', discord);

http.listen(process.env.PORT || 3000, function () {
    console.log('Server listening on port 3000.');
});
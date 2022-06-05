var express = require('express');
var app = express();

require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 5000;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});

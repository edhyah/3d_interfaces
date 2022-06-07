var express = require('express');
var app = express();

require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 5000;

//app.get('/home', function (req, res) {
//    res.sendFile(__dirname + '/index.html');
//});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});

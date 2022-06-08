const path = require('path');
const express = require('express');
var app = express();

require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 5000;

app.use(express.static(__dirname));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});

const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser")
const morgan = require('morgan');
const payment = require('./routes/payment.routes.js');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(payment);

app.listen(8000);
console.log("Server on port", 8000);

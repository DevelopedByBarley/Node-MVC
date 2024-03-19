require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


const port = process.env.PORT;
const db = require('./config/database');
const userRoutes= require('./app/routes/user');
const { token } = require('./app/helpers/generateToken');

app.use(bodyParser.json());


app.use('/user', userRoutes);
app.post('/token', token);

db();


app.listen(port, () => {
  console.log('App is listening on port ' + port);
})

const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use((req, res, next) => {
  req.user = {
    _id: '6400d2c29006152f64c35e36'
  };

  next();
});

app.use('/', routerUsers);
app.use('/cards', routerCards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
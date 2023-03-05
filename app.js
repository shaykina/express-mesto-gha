const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const PORT = 3000;
const app = express();
const ERROR_CODE_404 = 404;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use((req, res, next) => {
  req.user = {
    _id: '6400d2c29006152f64c35e36',
  };

  next();
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('/', (req, res) => {
  res.status(ERROR_CODE_404).send({ message: 'Указанный путь не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

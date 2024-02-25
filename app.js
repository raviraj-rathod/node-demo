require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to database"));

app.use(express.urlencoded({ extended: false }));
const cors = require('cors');
app.use(express.json());

// app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*")
  res.setHeader('Access-Control-Allow-Heeader', "Origin, X-Requested-with, Content-Type, Accept")
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, PUT, DELETE, OPTIONS")
  res.setHeader('Access-Control-Allow-Credentials', true);
  // res.cookie('myCookie', 'Hello, HTTPS Cookie!', { secure: true });
  next();
});
app.use(express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
  // res.cookie('myCookie', 'Hello, HTTPS Cookie!', { secure: true });
  res.sendFile('index.html');
});
const routes = require('./routes/routes');
app.use('/api', routes);

module.exports = app;
// const port = process.env.PORT || 1106;
// app.listen(port, () => console.log(`server is runnig on ${port}`));
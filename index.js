require("dotenv").config();
const connectToMongo = require('./db');
const express = require('express');
const app = express();
const cors = require('cors');

const port = 5000

connectToMongo();

//express server

app.use(cors());
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})

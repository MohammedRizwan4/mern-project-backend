const connectToMongo = require('./db');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = 5000

connectToMongo();

//express server

app.use(cors());
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  app.use(express.static("inotebook/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/inotebook/build/index.html"));
  });
}

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})

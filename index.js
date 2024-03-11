const connectMongo = require("./db");
const express = require('express');
const app = express();
var cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

connectMongo();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello World!')
    console.log(`Hello Hello`);
  })

//Available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

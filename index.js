const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 9000;
const url = "mongodb://localhost:27017"; // Replace with your MongoDB connection URL

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

var whitelist = ['file:///C:/src/node-express-crud/index.html'];

// Configure CORS options to allow any origin
const corsOptions = {
    origin: '*'
  };

app.use(cors(corsOptions)); // Apply CORS middleware with options

app.use(express.json());

const studentRouter = require("./routes/students");
app.use('/students', studentRouter);

try {
    con.on('open', () => {
        console.log('Connected to the database');
    });
} catch (error) {
    console.log("Error: " + error);
}

app.listen(port, () => {
    console.log('Server started on port ' + port);
});
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bearerToken = require('express-bearer-token');
const app = express();
const db = require("../models");
var authRouter = require('../routes/auth.routes');

let url = `mongodb+srv://nandani:123demo456@cluster0-cx6k2.mongodb.net/Cluster0?retryWrites=true&w=majority`;
db.mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true

  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });



function initial() {}

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(bearerToken());
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api/auth', authRouter);
// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
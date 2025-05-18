const readline = require('readline');
const express = require('express');
const path = require("path");
const mongoClient = require('./MongoClient');
const { MongoClient } = require('mongodb');
const routes = require('./routes');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const PORT = 3000

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

(async () => {
  try {
    const uri = process.env.MONGO_CONNECTION_STRING;
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();


app.get("/", (request, response) => {
    response.render("index");
});

app.listen(PORT, () => {
    console.log(`Web server started and running at http://localhost:3000`)
    
});

process.on('SIGINT', async () => {
    await mongoClient.close();
    process.exit(0);
});

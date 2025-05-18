
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const uri = process.env.MONGO_CONNECTION_STRING;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const dbName = process.env.MONGO_DB_NAME;

const favouritesCollection = 'favourites';



async function addFavourite(restaurantData) {
  const database = client.db(dbName);
  const collection = database.collection(favouritesCollection);
  const result = await collection.insertOne(restaurantData);
  return result;
}

async function getAllFavourites() {
  const database = client.db(dbName);
  const collection = database.collection(favouritesCollection);
  const favourites = await collection.find({}).toArray();
  return favourites;
}

async function close() {
    await client.close();
}

module.exports = {
  addFavourite,
  getAllFavourites,
  close
};

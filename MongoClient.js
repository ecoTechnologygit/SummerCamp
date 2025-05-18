
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
const collectionName = process.env.MONGO_COLLECTION;


async function connect() {
  try {
    await client.connect();
    return true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return false;
  }
}

async function addApplication(applicationData) {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(applicationData);
    return result;
  }

async function getAllApplications() {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const applications = await collection.find({}).toArray();
    return applications;
  }


async function getApplicationsByGPA(minGPA) {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const applications = await collection.find({ gpa: { $gte: parseFloat(minGPA) } }).toArray();
    return applications;
  }


async function removeAllApplications() {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const result = await collection.deleteMany({});
    return result;
}


async function close() {
    await client.close();
}

module.exports = {
  connect,
  addApplication,
  getAllApplications,
  getApplicationsByGPA,
  removeAllApplications,
  close
};

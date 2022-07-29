const MongoClient = require('mongodb').MongoClient;
const { v4: uuid_v4 } = require('uuid');
require('dotenv').config();
const url = process.env.MONGO_URL;
let db = null;

MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
  db = client.db('myproject');
});

const create = (authId, name, email, password) => {
  return new Promise((resolve, reject) => {
    const collection = db.collection('users');
    let doc = {authId, name, email, password, role: 'user', balance: 0, status: 'active', failedAttempts: 0};
    collection.insertOne(doc, {w:1}, (err, result) => {
      err ? reject(err) : resolve(doc);
    });
  });
}

const transaction = async (authId, transaction, balance) => {
  const newTransId = uuid_v4();
  const user = await findAuth(authId);
  let transactions = ((user!==null && user.transactions !==undefined) && Array.isArray(user.transactions)) ? user.transactions : [];
  let newTransaction = {transId: newTransId, date: new Date().toISOString().slice(0, 10), starting: user.balance, transaction: transaction, ending: balance, image: false};
  transactions = [...transactions, newTransaction];
  return new Promise((resolve, reject) => {
    const collection = db.collection('users');
    collection.updateOne({authId: authId}, {$set: {balance: balance, transactions: transactions}}, {upsert: true})
      .then((doc) => resolve({doc, newTransaction: [newTransaction]}))
      .catch((err) => reject(err));
  });
}

const updatefailedAttempts = (authId, failedAttempts) => {
  return new Promise((resolve, reject) => {
    const collection = db.collection('users');
    collection.updateOne({authId: authId}, {$set: {failedAttempts: failedAttempts, status: failedAttempts>=6 ? 'disabled' : 'active'}}, {upsert: true})
      .then((doc) => resolve({doc}))
      .catch((err) => reject(err));
  });
}

const image = async (authId, transId) => {
  const user = await findAuth(authId);
  let transactions = ((user!==null && user.transactions !==undefined) && Array.isArray(user.transactions)) ? user.transactions : [];
  for (let i=0; i<transactions.length; i++) {
    if (transactions[i].transId === transId) {
      transactions[i].image = true;
      break;
    }
  }
  return new Promise((resolve, reject) => {
    const collection = db.collection('users');
    collection.updateOne({authId: authId}, {$set: {transactions: transactions}}, {upsert: true})
      .then((doc) => resolve({doc}))
      .catch((err) => reject(err));
  });
}

const all = () => {
  return new Promise((resolve, reject) => {
    const users = db
      .collection('users')
      .find({})
      .toArray((err, docs) => {
        err ? reject(err) : resolve(docs);
    });
  });
}
const findOne = (email) => {
  return new Promise((resolve, reject) => {
    const users = db
      .collection('users')
      .findOne({email: email})
      .then((doc) => resolve(doc))
      .catch((err) => reject(err));
  });
}
const findAuth = (authId) => {
  return new Promise((resolve, reject) => {
    const users = db
      .collection('users')
      .findOne({authId: authId})
      .then((doc) => resolve(doc))
      .catch((err) => reject(err));
  });
}

module.exports = {create, all, findOne, findAuth, transaction, updatefailedAttempts, image};
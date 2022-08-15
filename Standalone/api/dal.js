const e = require('express');
const mongoose = require('mongoose');
const { v4: uuid_v4 } = require('uuid');
require('dotenv').config();
const User = require('../schema/UserSchema');
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {useNewUrlParser: true});
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
connectDB();

const createUser = (authId, name, email, password, dob, phone, address, csz, savings, checking) => {
  return new Promise((resolve, reject) => {
    try {
      let accounts = [];
      if (parseInt(savings)===1) accounts.push({actId: uuid_v4(), type: 'Savings', balance: savings, transactions: []});
      if (parseInt(checking)===1) accounts.push({actId: uuid_v4(), type: 'Checking', balance: checking, transactions: []});
      const user = new User({authId, name, email, password, dob: dob, phone: phone, address: address, csz: csz, accounts: accounts});
      user.save()
        .then((docs) => resolve(docs))
        .catch((err) => reject(err));
    }
    catch (err) {
      reject(err);
    }
  });
}
const updateUser = async (authId, name, dob, phone, address, csz) => {
  const user = new User(await findAuthUser(authId));
  return new Promise((resolve, reject) => {
    try {
      user.name = name;
      user.dob = dob;
      user.phone = phone;
      user.address = address;
      user.csz = csz;
      user.save()
        .then((docs) => resolve(docs))
        .catch((err) => reject(err));
    }
    catch (err) {
      reject(err);
    }
  });
}
const deleteUser = async (authId) => {
  const user = new User(await findAuthUser(authId));
  return new Promise((resolve, reject) => {
    try {
      if (user.accounts.length === 0) {
        user.delete()
          .then((docs) => resolve(docs))
          .catch((err) => reject(err));
      } else {
        reject({error: 'User has accounts'});
      }
    }
    catch (err) {
      reject(err);
    }
  });
}

const updatefailedAttempts = (authId, failedAttempts) => {
  return new Promise((resolve, reject) => {
    try {
      User.updateOne({authId: authId}, {$set: {failedAttempts: parseInt(failedAttempts), status: parseInt(failedAttempts)>=6 ? 'disabled' : 'active'}}, {upsert: true})
        .then((docs) => resolve(docs))
        .catch((err) => reject(err));
    }
    catch (err) {
      reject(err);
    }
  });
}

const createTransaction = async (authId, actId, type, transaction, actBalance, totBalance) => {
  const newTransId = uuid_v4();
  const user = new User(await findAuthUser(authId));
  let account = user!==null && user.accounts!== undefined ? user.accounts.find((account) => account.actId == actId) : {};
  let transactions = account!==null && account.transactions !== undefined ? account.transactions : {};
  let newTransaction = {transId: newTransId, type: type, starting: parseFloat(account.balance), transaction: parseFloat(transaction), ending: parseFloat(actBalance), image: false};
  transactions = [...transactions, newTransaction];
  for (let i=0; i<user.accounts.length; i++) {
    if (user.accounts[i].actId === actId) {
      user.accounts[i].balance = parseFloat(actBalance);
      user.accounts[i].transactions = transactions;
      break;
    }
  }
  user.balance = parseFloat(totBalance);
  
  return new Promise((resolve, reject) => {
    try {
      user.save()
        .then((docs) => resolve(docs))
        .catch((err) => reject(err));
    }
    catch (err) {
      reject(err);
    }
  });
}
const updateImage = async (authId, actId, transId) => {
  const user = await findAuth(authId);
  let accounts = ((user!==null && user.accounts !==undefined) && Array.isArray(user.accounts)) ? user.accounts : [];
  for (let j=0; j<accounts.length; j++) {
    if (accounts[j].actId === actId) {
      for (let i=0; i<accounts[j].transactions.length; i++) {
        if (accounts[j].transactions[i].transId === transId) {
          accounts[j].transactions[i].image = true;
          break;
        }
      }
    }
  }
  user.accounts = accounts;
  return new Promise((resolve, reject) => {
    try {
      user.save()
        .then((docs) => resolve(docs))
        .catch((err) => reject(err));
    }
    catch (err) {
      reject(err);
    }
  });
}

const allUsers = () => {
  return new Promise((resolve, reject) => {
    try {
      User.find({})
        .then((docs) => resolve(docs))
        .catch((err) => reject(err));
    }
    catch (err) {
      reject(err);
    }
  });
}
const findOneUser = (email) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({email: email})
        .then((docs) => resolve(docs))
        .catch((err) => reject(err));
    }
    catch (err) {
      reject(err);
    }
  });
}
const findAuthUser = (authId) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({authId: authId})
        .then((docs) => resolve(docs))
        .catch((err) => reject(err));
    }
    catch (err) {
      reject(err);
    }
  });
}

module.exports = {createUser, updateUser, deleteUser, allUsers, findOneUser, findAuthUser, createTransaction, updatefailedAttempts, updateImage};
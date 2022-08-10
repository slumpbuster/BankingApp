const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const dal = require('../api/dal');
let port = process.env.PORT || 3000;
const secretKey = process.env.SECRETKEY;
const algorithm = process.env.ALGORITHM;
const expires = process.env.EXPIRES;
const mongo = process.env.MONGO_URL;
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
};
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');

app.use(express.static('public'));
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/account/all", (req,res)=>{
    dal.all()
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.send({error: err});
        });
})
app.get("/account/findOne/:email", (req,res)=>{
    dal.findOne(req.params.email)
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.send({error: err});
        });
})
app.get('/account/create/:authId/:name/:email/:password/:dob/:phone/:address/:csz/:savings/:checking', (req, res) => {
    dal.create(req.params.authId, req.params.name, req.params.email, encrypt(req.params.password), req.params.dob, req.params.phone, req.params.address, req.params.csz, req.params.savings, req.params.checking)
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.send({error: err});
        });
})

app.listen(port, function () {
    console.log(`Running on port ${port}`);
});
const express = require('express');
const app = express();
const cors = require('cors');
const dal = require('./api/dal');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
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

const createToken = (data) => {
  try {
    return jwt.sign(data, secretKey, { expiresIn: expires });
  } catch (err) {
    console.log(err);
  }
  return null;
}
const verifyToken = (req) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token != null) {
    try {
      return jwt.verify(token, secretKey, (err, data) => {
        if (err) {
          if (err instanceof jwt.TokenExpiredError) return {error: 'expired'};
          return null;
        }
        return data;
      });
    } catch (err) {
      console.log(err);
    }
  }
  return null;
}

app.use(express.static('public'));
app.use(cors());

const encrypt = (text) => {    
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return btoa(JSON.stringify({
      iv: iv.toString('hex'),
      content: encrypted.toString('hex')
  }));
};

const decrypt = (hash) => {
  hash=JSON.parse(atob(hash));
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrpyted.toString();
};

app.get('/account/create/:authId/:name/:email/:password/:dob/:phone/:address/:csz/:savings/:checking', (req, res) => {
  dal.create(req.params.authId, req.params.name, req.params.email, encrypt(req.params.password), req.params.dob, req.params.phone, req.params.address, req.params.csz, req.params.savings, req.params.checking)
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      res.send({error: err});
    });
})
app.get('/account/update/:name/:dob/:phone/:address/:csz', (req, res) => {
  let auth = verifyToken(req);
  if (auth===null) {
    res.send({error: 'Invalid token'});
  } else if (auth.error!==undefined) {
    res.send({error: auth.error});
  } else {
    dal.update(auth.authId, req.params.name, req.params.dob, req.params.phone, req.params.address, req.params.csz)
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        res.send({error: err});
      });
  }
})

app.get('/account/transfer/:from/:to/:transaction/:fromBalance/:toBalance/:totBalance', (req, res) => {
  let auth = verifyToken(req);
  if (auth===null) {
    res.send({error: 'Invalid token'});
  } else if (auth.error!==undefined) {
    res.send({error: auth.error});
  } else {
    dal.transaction(auth.authId, req.params.from, "Transfer", -Math.abs(parseFloat(req.params.transaction)), parseFloat(req.params.fromBalance), parseFloat(req.params.totBalance))
      .then(user => {
        dal.transaction(auth.authId, req.params.to, "Transfer", parseFloat(req.params.transaction), parseFloat(req.params.toBalance), parseFloat(req.params.totBalance))
          .then(user => {
            res.send(user);
          })
          .catch(err => {
            res.send({error: err});
          });
      })
      .catch(err => {
        res.send({error: err});
      });
  }
})
app.get('/account/transaction/:type/:transaction/:actBalance/:totBalance', (req, res) => {
  let auth = verifyToken(req);
  if (auth===null) {
    res.send({error: 'Invalid token'});
  } else if (auth.error!==undefined) {
    res.send({error: auth.error});
  } else {
    dal.transaction(auth.authId, auth.actId, req.params.type, parseFloat(req.params.transaction), parseFloat(req.params.actBalance), parseFloat(req.params.totBalance))
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        res.send({error: err});
      });
  }
})

app.get('/account/update/image/:transId', (req, res) => {
  let auth = verifyToken(req);
  if (auth===null) {
    res.send({error: 'Invalid token'});
  } else if (auth.error!==undefined) {
    res.send({error: auth.error});
  } else {
    dal.image(auth.authId, auth.actId, req.params.transId)
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        res.send({error: err});
      });
  }
})

app.get('/account/login/:email/:password', (req, res) => {
  dal.findOne(req.params.email)
    .then(user => {
      if (user.status === 'active') {
        if (decrypt(user.password) === atob(req.params.password)){
          let token = createToken({authId: user.authId, role: user.role});
          if (user.failedAttempts > 0)
          {
            user.failedAttempts = 0;
            dal.updatefailedAttempts(user.authId, user.failedAttempts);
          }
          user = {user, token: token};
          res.send(user);
        } else {
          user.failedAttempts = parseInt(user.failedAttempts)+1;
          dal.updatefailedAttempts(user.authId, user.failedAttempts);
          res.send({error: 'Login failed: wrong password'});
        }
      } else {
        res.send({error: 'Login failed: account is not active'});
      }
    })
    .catch(err => {
      res.send({error: 'Login failed: user not found'});
    });
});
app.get('/account/createToken/:actId', (req, res) => {
  let auth = verifyToken(req);
  if (auth===null) {
    res.send({error: 'Invalid token'});
  } else if (auth.error!==undefined) {
    res.send({error: auth.error});
  } else {
    let token = createToken({authId: auth.authId, role: auth.role, actId: req.params.actId});
    res.send({token: token});
  }
});

app.get('/account/status/:failedAttempts/:userId', (req, res) => {
  let auth = verifyToken(req);
  if (auth===null) {
    res.send({error: 'Invalid token'});
  } else if (auth.error!==undefined) {
    res.send({error: auth.error});
  } else {
    if (auth.role === 'employee') {
      dal.findAuth(req.params.userId)
        .then(user => {
          user.failedAttempts = req.params.failedAttempts;
          user.status = req.params.failedAttempts===0 ? 'active' : 'disabled';
          dal.updatefailedAttempts(user.authId, user.failedAttempts)
          .then(update => {
            res.send(user);
          })
          .catch(err => {
            res.send({error: err});
          });
        })
        .catch(err => {
          res.send({error: err});
        });
      } else {
        res.send({error: 'You are not an employee'});
      }
    }
})

app.get('/account/alldatatest/', (req, res) => {
  dal.all()
    .then(users => {
      users.map(user => {
        user.password = decrypt(user.password);
      });
      res.send(users);
    })
    .catch(err => {
      res.send({error: err});
    });
})

app.get('/account/all/', (req, res) => {
  let auth = verifyToken(req);
  if (auth===null) {
    res.send({error: 'Invalid token'});
  } else if (auth.error!==undefined) {
    res.send({error: auth.error});
  } else {
    if (auth.role!==undefined && auth.role==='employee') {
      dal.all()
        .then(users => {
          users.map(user => {
            user.password = decrypt(user.password);
          });
          res.send(users);
        })
        .catch(err => {
          res.send({error: err});
        });
      } else {
        res.send({error: 'You are not an Employee'});
      }
    }
})
app.get('/account/findOne/:email', (req, res) => {
  dal.findOne(req.params.email)
    .then(user => {
      res.send({user: user.email});
    })
    .catch(err => {
      res.send({error: 'user not found'});
    });
})
app.get('/account/findAuth/', (req, res) => {
  let auth = verifyToken(req);
  if (auth===null) {
    res.send({error: 'Invalid token'});
  } else if (auth.error!==undefined) {
    res.send({error: auth.error});
  } else {
    dal.findAuth(auth.authId)
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        res.send({error: err});
      });
    }
})

app.get('/config/:info', (req, res) => {
  switch(req.params.info) {
    case 'firebaseConfig':
      res.send(firebaseConfig);
      break;
    case 'mongo':
      res.send(mongo);
      break;
    default:
      res.send({error: 'Invalid config'});
  }
})

app.listen(port, () => console.log(`Running on port ${port}`));

module.exports = { app, firebaseConfig };
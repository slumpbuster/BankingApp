const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    authId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    dob: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    csz: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'active'
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    failedAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    accounts: [{
        actId: {
            type: String
        },
        type: {
            type: String,
            required: true
        },
        balance: {
            type: Number,
            required: true,
            default: 0
        },
        transactions: [{
            transId: {
                type: String
            },
            date: {
                type: Date,
                required: true,
                default: Date.now
            },
            type: {
                type: String,
                required: true
            },
            starting: {
                type: Number
            },
            transaction: {
                type: Number
            },
            ending: {
                type: Number
            },
            image: {
                type: Boolean,
                default: false
            }
        }]
    }]
});

module.exports = User = mongoose.model('user', UserSchema);

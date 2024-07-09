const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId: {
        type: String,
    },
    name: {
        type: String,
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String,
    },
    verificationToken: {
        type: String
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    },
    resetToken: {
        type: String
    }
});

userSchema.methods.incrementLoginAttempts = async function () {
    this.loginAttempts++;
    await this.save();
}

userSchema.methods.resetLoginAttempts = async function () {
    this.loginAttempts = 0;
    await this.save();
}

const User = mongoose.model('user', userSchema);

module.exports = User;
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    phone: Number,
    email: String,
    gender: String,
    imagePath: String
})

module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // The name of the collection
    seq: { type: Number, default: 0 } // The last used sequence number
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;

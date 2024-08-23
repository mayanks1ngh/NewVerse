const Counter = require('./Counter'); // Assuming Counter model is in the same directory

async function getNextSequenceValue(collectionName) {
    const counter = await Counter.findByIdAndUpdate(
        collectionName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Create the counter document if it doesn't exist
    );
    return counter.seq;
}
module.exports = getNextSequenceValue;

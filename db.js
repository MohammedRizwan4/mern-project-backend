const mongoose = require('mongoose');
const mongoURI = process.env.DATABASE

const connectToMongo = () => {
    mongoose.connect(mongoURI ,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    } ,() => {
        console.log("Connected to mongo successfully");
    })
}

module.exports = connectToMongo;

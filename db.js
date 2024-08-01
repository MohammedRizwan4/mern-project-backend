const mongoose = require('mongoose');
const mongoURI = process.env.DATABASE

const connectToMongo = () => {
    try {
        mongoose.connect(mongoURI, () => {
            console.log(`connected `)
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectToMongo;

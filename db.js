const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://inotebook8:Rizwan0411@cluster0.zqrs4qo.mongodb.net/inotebook8?retryWrites=true&w=majority";

const connectToMongo = () => {
    mongoose.connect(mongoURI ,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    } ,() => {
        console.log("Connected to mongo successfully");
    })
}

module.exports = connectToMongo;

require('dotenv').config({path:'./.env.local'});

const mongoose = require('mongoose');

mongoose.set("strictQuery", true);

const connectToMongo = () => {
    mongoose.connect(process.env.MONGODB_URI, () => {
        console.log("connected successfully!!");
    }).catch(e => console.log(e));
}

module.exports = connectToMongo;


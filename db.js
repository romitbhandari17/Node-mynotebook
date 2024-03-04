const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/mynotebook?directConnection=true&readPreference=primary&tls=false';

const connectMongo = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Mongo");
    } catch (err) {
        console.error("Could not connect to Mongo", err);
    }
};

module.exports= connectMongo;
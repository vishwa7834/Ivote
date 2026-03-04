const mongoose = require('mongoose');

const uri = "mongodb+srv://Vishwa3103:Vishwa3103@cluster0.7gwjvkl.mongodb.net/ivote?appName=Cluster0";

mongoose.connect(uri)
    .then(() => {
        console.log("SUCCESS: Connected to MongoDB Atlas");
        process.exit(0);
    })
    .catch(err => {
        console.error("FAILED to connect:", err.message);
        process.exit(1);
    });

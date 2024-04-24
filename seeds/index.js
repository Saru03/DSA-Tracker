const mongoose = require('mongoose');
const problems=require('./problems')
const Problem=require('../models/problem')

mongoose.connect('mongodb://127.0.0.1:27017/dsa-tracker');
mongoose.set('strictQuery', true);

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",() =>{
    console.log("Database connected");
})

const seedDB = async () =>{
    await Problem.deleteMany({});
    for(let i=0; i<9; i++) {
        const quest = new Problem({
            author:'661fcbe94b64d3f4bbfcff2c',
            title:`${problems[i].title}`,
            difficulty:`${problems[i].difficulty}`,
            topic:`${problems[i].topic}`,
            reviewPriority:`${problems[i].reviewPriority}`,
            reviewCount:`${problems[i].reviewCount}`, 
            solution:`${problems[i].solution}`,
            learning:`${problems[i].learning}`,
            postedDate:Date.now()
        })
    await quest.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})
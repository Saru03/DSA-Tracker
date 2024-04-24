const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')
const problemSchema = new Schema({
    title: {
        type: String, //title of the question with number
        required:true
    },
    difficulty: {
        type:String,
        enum:['easy','medium','hard'],
        required:true
    },
    topic: {
        type:String
    },
    reviewPriority: {
        type:String,
        enum:['low','midway','high'],
        default:'low'
    },
    reviewCount: {
        type:Number,
        default:'0'
    },
    solution: {
        type:String,
    },
    learning:{
        type:String
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    postedDate:{
        type:Date,
        default:Date.now
    }
    
})

module.exports=mongoose.model('Problem',problemSchema)


import mongoose, { Schema } from "mongoose";



const urlschema = new Schema({
    url:{
        type:String,
    },
    type:{
        type:String,
        enum:["video","image"],

    },
    createdAt:{
        type:Date,
        default:Date.now,
    },

})

export const urlModel = mongoose.model("Url",urlschema);
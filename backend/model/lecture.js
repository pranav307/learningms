import mongoose, { Schema } from "mongoose";



const lectureSchema = new Schema({
  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
  },
  vedioUrl:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Url",

  },
  title:{
    type:String,
  },
  duration:{
    type:String,
  },
  order:{
    type:Number,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }
},{timestamps:true});

export const lecturemodel = mongoose.model("lecture",lectureSchema);
import mongoose,{ Schema } from "mongoose";



const lecturprogress = new Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    courseid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completeLecture:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lecture"
    }],
     
},{timestamps:true});

export const lecturepro = mongoose.model("Lecprogress",lecturprogress);
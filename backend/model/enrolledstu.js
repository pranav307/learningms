import mongoose, { Schema } from "mongoose";



const Enrolledschema = new Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    purchaseDate:{
        type:Date,
        default:Date.now,
    },
    price:{
         type:Number,
         
    },
    paymentStatus:{
        type:String,
        enum:["pending","success","failed"],
        default:"pending",
        
    },
    paymentType:{
        type:String,
        enum:["paypal","card"],
        default:"card",
        
    },
    orderStatus:{
        type:String,
        enum:["proccessing","completed","cancel"]
    },
     transactionId:{
     type:String,
     required:function(){
        return this.paymentStatus === "success";
     },
     },
     title:{
        type:String,
     },

   
},{timestamps:true});
Enrolledschema.index({userId:"1",courseId:"1"});


export const Enrolled =mongoose.model("Enroll",Enrolledschema);
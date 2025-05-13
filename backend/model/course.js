import mongoose, { Schema } from "mongoose";

const CourseSchema = new Schema({
    courseTitle: {
        type: String,
        required: true,
    },
    subTitle: { type: String },
    description: { type: String },
    category: {
        type: String,
        required: true,
    },
    courseLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
    },
    Thumbnail: {  
        type: String, // Changed from ObjectId to String for URLs
    },
    isfree:{
      type:Boolean,
      default:false,
 },
    coursePrice: {
        type: Number,
        
         // Ensuring price is always provided
      min:0,
      validate:{
        validator:function(value){
            return !this.isfree;   // coursePrice should only exist when isfree is false
        },
        message:"course price must not contain"
      }
    },
    lectures: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "lecture",
    }],
    creator: {
       userid:{ type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       },
       role:{
         type:String,enum:["admin","creators"],
       },
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0, // Added rating validation
    },
createdAt:{
    type:Date,
}
  
}, { timestamps: true });
CourseSchema.pre("save",function(next){
    if(this.isfree){
        this.coursePrice =undefined;  //Remove coursePrice if isfree is true
    }
    else {
        this.isfree =false;
    }
    next();
})

CourseSchema.index({ courseTitle: "text", category: "text", description: "text" });

export const courseModel = mongoose.model("Course", CourseSchema);

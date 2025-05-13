import mongoose,{Schema} from "mongoose";



const cartSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    price:{
        type:Number,

    },
});
 export const cartModel = mongoose.model("cart",cartSchema);
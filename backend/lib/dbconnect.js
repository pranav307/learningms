import mongoose from "mongoose"



export async function dbconnect(){
    try {
         const connectioninstance = await mongoose.connect(`${process.env.MONGODB_KEY}`);
         console.log(`mongo db connected || db host ${connectioninstance.connection.host}`)
    } catch (error) {
       console.log("error in connectiong database",error); 
       process.exit(1);
    }
}
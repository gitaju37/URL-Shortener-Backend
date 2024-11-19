import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config()

const connectDb = async(req,res) => {
    try {
        const connection = await mongoose.connect( process.env.mongoDBconnectingString )
        console.log( "DB Connected" )
        return connection
        
    } catch (error) {
      res.staus(404).json(error,"Internal Server Error")
    }


}

export default connectDb
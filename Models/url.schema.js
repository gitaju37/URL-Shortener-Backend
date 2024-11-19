import mongoose from 'mongoose'

const urlSchema = mongoose.Schema( {
    userId: {
        type:mongoose.Schema.Types.ObjectId
    },
    originalUrl: {
        type:String
    },
    shortUrl: {
        type:String
    },
    shortUrlID: {
        type: String
    },
    clickCount: {
        type:Number
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
} )

const ShortUrl = mongoose.model( "ShortUrl", urlSchema )
export default ShortUrl
import mongoose from "mongoose";

const userSchema = mongoose.Schema( {
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    activationToken: {
        type: String,
        default: null,
    },
    activationTokenExpiry: {
        type: Date,
        default: null,
    },
    activationStatus: {
        type: Boolean,
        default: false,
    },
    pwdVerifyString: {
        type: String,
        default: null,
    },
    resetTime: {
        type: Number,
        default: null,
    },
} );

const User = mongoose.model( "User", userSchema );
export default User;

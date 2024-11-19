import User from "../Models/user.schema.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifymail,mail } from "../Services/nodemailer.service.js";
dotenv.config();

export const userRegister = async ( req, res ) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await User.findOne( { email } );
        if ( existingUser ) {
            return res.status( 400 ).json( { message: "Email already exists" } );
        }

        const hashPassword = await bcrypt.hash( password, 10 );

        const activationToken = jwt.sign( { email }, process.env.JWT_SECRET, { expiresIn: '1d' } );

        const newUser = new User( {
            firstName,
            lastName,
            email,
            password: hashPassword,
            activationToken,
            activationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000 
        } );
        await newUser.save();

        await verifymail( email, activationToken );

        res.status( 201 ).json( { message: "User registered successfully. Please check your email to activate your account." } );
    } catch ( error ) {
        console.error( "Registration Error:", error );
        res.status( 500 ).json( { message: "Internal Server Error" } );
    }
};

export const activateUser = async ( req, res ) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify( token, process.env.JWT_SECRET );
        const user = await User.findOne( { email: decoded.email } );

        if ( !user ) {
            return res.status( 404 ).json( { message: "User not found" } );
        }
        if ( user.activationStatus == true ) {
            return res.status( 400 ).json( { message: "Account already activated" } );
        }

        if ( user.activationToken !== token || user.activationTokenExpiry < Date.now() ) {
            return res.status( 400 ).json( { message: "Invalid or expired token" } );
        }

      
        user.isActive = true;
        user.activationToken = null; 
        user.activationTokenExpiry = null;
        user.activationStatus = true;
        await user.save();

        res.status( 200 ).json( { message: "Activated" } );
    } catch ( error ) {
        console.error( "Activation Error:", error );
        res.status( 500 ).json( { message: "Internal Server Error" } );
    }
};

export const userLogin = async ( req, res ) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne( { email } );
        if ( !user ) {
            return res.status( 401 ).json( { message: "Invalid Email" } );
        }

        const passwordMatch = await bcrypt.compare( password, user.password );
        if ( !passwordMatch ) {
            return res.status( 401 ).json( { message: "Invalid Password" } );
        }

        const token = jwt.sign( { _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" } );

        user.activationToken = token
        await user.save()

        res.status( 200 ).json( { message: "Login Successful", token:token } );
    } catch ( error ) {
        console.error( "Login Error:",error ); 
        res.status( 500 ).json( { message: "Internal Server Error" } );
    }
};

export const forgotPassword = async ( req, res ) => {
    const { email } = req.body;
 

    try {
        const user = await User.findOne( { email } );
       
        if ( !user ) {
            return res.status( 404 ).json( { message: "USER NOT EXISTS" } );
        }

        function generateRandomString( length ) {
            return Math.random().toString( 36 ).substring( 2, 2 + length );
        }

        const randomString = generateRandomString( 10 );
        const resetTime = new Date().getTime() + 600000;

       
        user.resetTime = resetTime;
        user.pwdVerifyString = randomString;
       

        await user.save();

        await mail( email, randomString );

        res.status( 200 ).json( { message: "PASSWORD RESET LINK SENT TO EMAIL" } );

    } catch ( error ) {
        console.error( error );
        res.status( 500 ).json( { message: "INTERNAL SERVER ERROR" } );
    }
};


export const changePassword = async ( req, res ) => {
    const { pwdVerifyString, newPassword } = req.body;

    try {
        const user = await User.findOne( { pwdVerifyString } );
        
        const currentTime = new Date().getTime();
        if ( !user ) {
            return res.status( 401 ).json( { message: "NOT MATCHED" } );
        }
        if ( user.resetTime < currentTime ) {
            user.pwdVerifyString = null;
            user.resetTime = null;
            await user.save();
            return res.status( 404 ).json( { message: "link expired" } );
        }

        const hashPassword = await bcrypt.hash( newPassword, 10 );
        user.password = hashPassword;
        user.pwdVerifyString = null;
        user.resetTime = null;

        await user.save();
        res.status( 200 ).json( { message: "PASSWORD CHANGED SUCCESSFULLY" } );

    } catch ( error ) {
        console.error( error );
        res.status( 500 ).json( { message: "INTERNAL SERVER ERROR" } );
    }
};

import nodemailer, { createTransport } from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()



export const mail = ( email, randomString ) => {
    
    const transport = nodemailer.createTransport( {
        service: "gmail",
        auth: {
            user: process.env.USER,
            pass:process.env.PASS
        }
    })
    
    let details = {
        from: process.env.User,
        to: email,
        subject: "Reset Password",
        html: `
         <h3>Dear User</h3>
        <p>We received a request to reset your password for your account. You can reset your password using the link below:</p>
        <button><a href="http://localhost:5173/changepassword/">Click here to reset</a></button>
        <h3>Verification Code:<b>${randomString}</b></h3>
        <p>If you didn’t request a password reset, you can ignore this email. Your password will remain unchanged.</p>
        <p>For your security, please reset your password as soon as possible.</p>
        <p>Thnak You !</p>
        <p>Best Regards</p>
        <p>Ajith Arumugam</p>
        `   }
    
    transport.sendMail( details, ( err ) => {
        if ( err ) {
            console.log("Check Credentials")
        } else {
            console.log("Email sent successfully")
        }
    })
}

export const verifymail = ( email, pwdverifyString ) => {
    
    const transport = nodemailer.createTransport( {
        service: "gmail",
        auth: {
            user: process.env.USER,
            pass:process.env.PASS
        }
    } )

    const resetLink = `http://localhost:5173/activation/${pwdverifyString }`
    
    let details = {
        from: process.env.User,
        to: email,
        subject: "Account Activation",
        html:
            `
            <h3>Please Click below Button to Activate Your Account</h3>
            <button><a href="${resetLink}" style="
           display: inline-block;
           padding: 10px 20px;
           font-size: 16px;
           color: #ffffff;
           background-color: #007bff;
           text-align: center;
           text-decoration: none;
           border-radius: 5px;
           font-family: Arial, sans-serif;
           font-weight: bold;">Activate</a></button>
        `
    }
    transport.sendMail( details, (err) => {
        if ( err ) {
            console.log("Check Credentials")
        } else {
            console.log("Email Sent SuccesFully")
        }
    })
    }

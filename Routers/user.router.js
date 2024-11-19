import express from 'express'
import { activateUser, changePassword, forgotPassword, userLogin, userRegister } from '../Controllers/user.controller.js'


const router = express.Router()

router.post( '/register', userRegister )
router.post( '/login', userLogin )
router.post( '/fgpassword', forgotPassword )
router.post('/pwreset',changePassword)
router.post('/activation',activateUser)

export default router
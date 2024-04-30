import express from 'express'
import UserRouter from './user.js'
import generatepdf from "../controller/pdfPupperter.js"

const router= express.Router()

router.use('/user',UserRouter)

router.post('/generatepdf',generatepdf)

export default router 

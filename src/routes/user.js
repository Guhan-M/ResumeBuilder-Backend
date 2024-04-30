import express from 'express'
import UserController from '../controller/user.js'
import validate from '../middleware/Validate.js'
import generatepdf from '../controller/pdfPupperter.js'

const router= express.Router()

router.post('/signup',UserController.signUp)
router.post('/login',UserController.login)
router.get('/dashboard',UserController.getAllUsers)
router.post("/forgetPassword",UserController.forgetPassword) 
router.post("/resetPassword/:token",UserController.resetPassword) 

router.get('/:id',validate,UserController.getUserById)
router.post('/createresumetemplate',UserController.createResumeTemplate)
router.post('/:id/formalresume1model',UserController.formalresume1create)
router.post('/:id/formalresume2model',UserController.formalresume2create)
router.post('/:id/formalresume3model',UserController.formalresume3create)

router.post('/:id/uploadresume2',UserController.uploadimageresume2)

router.get('/:id/getresumedata',UserController.getresumedata)
router.get('/:id/viewresumedata',UserController.viewresumedata)
router.get('/:id/viewresumedata2',UserController.viewresumedata2)
router.get('/:id/viewresumedata3',UserController.viewresumedata3)

router.delete('/:id/deleteresume',UserController.deleteresume)

router.get('/generateresumeid/:id',UserController.getresumedataid)
router.post('/generatepdf/:id',generatepdf)

export default router
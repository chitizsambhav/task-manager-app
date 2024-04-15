const User = require('../src/models/users')
const express = require('express')
const auth = require('../src/middleware/auth')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendDeleteEmail} = require('../src/email/account')


router.post('/user', async (req,res)=>{
    const user = new User(req.body)

    try{
        await user.save()
        sendWelcomeEmail(req.body.email, req.body.name)
        const token = await user.getAuthToken()
        res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/user/login', async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.getAuthToken()
        res.status(200).send({user, token})
    }
    catch (e){
        res.status(404).send(e)
    }
})

router.post('/user/logout', auth, async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/user/logoutAll', auth, async(req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/user/me', auth, async (req,res)=>{
    try{
        const user = req.user
        res.status(200).send(user)
    }
   catch(e){
    res.status(500).send(e)
    }
})

router.get('/user', async (req,res)=>{
    try{
        const user = await User.find({})
        res.status(200).send(user)
    }
   catch(e){
    res.status(500).send(e)
    }
})

router.get('/user/:id', async (req,res)=>{

    try{
        const _id = req.params.id
        const val = await User.findById(_id)
        if (!val){
            return res.status(400).send()
        }
        res.status(200).send(val)
    }   
    catch (e){
        res.status(500).send(e)
    }
})

router.patch('/user/me', auth, async(req,res)=>{
    requestFields = Object.keys(req.body)
    allowedFields = ['name', 'email' ,'password', 'age']

    const isValid = requestFields.every((field)=>{
        return allowedFields.includes(field)
    })

    if (!isValid){
        return res.status(400).send("Given Field is not correct")
    }
    try{
        requestFields.forEach((field) => {
            req.user[field] = req.body[field]
        })
        await req.user.save()
        // const val = await User.findByIdAndUpdate(req.params.id, req.body, {runValidators:true, new:true})
        
        res.status(200).send(req.user)
    }
    catch (e){
        res.status(500).send(e)
    }

})

router.delete('/user/me', auth, async(req,res)=>{
    try{
        const user = await req.user.deleteOne()
        sendDeleteEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    }
    catch (e){
        res.status(500).send(e)
    }
})

// const storage = multer.diskStorage({
//     filename: function (req, file, cb){
//         const timeStamp = new Date().toISOString()
//         const uniquesuffix = timeStamp + '-' + Math.round(Math.random()*(1E9))
//         cb(null, file.fieldname+'-'+uniquesuffix+ '.' + (file.originalname).split('.').pop() )
//     },
// })

const upload = multer({
    limits: {fileSize:10000000},
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error("Please provide an Image"))
        }
        return cb(null, true)
    },   
})
router.post('/user/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
   
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error, req, res, next)=>{
    res.status(400).send(error.message)
})

router.delete('/user/me/deleteAvatar', auth, async (req,res)=>{
    req.user.avatar = null
    try {
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
    
})

router.get('/user/:id/avatar', async(req,res)=>{
    const user = await User.findById({_id:req.params.id})
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
})
module.exports = router
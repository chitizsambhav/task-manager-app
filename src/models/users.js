const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const authToken = require('jsonwebtoken')
const Task = require('../models/tasks')

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:[true, 'User Name is required'],
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Please provide a valid Email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})){
                throw new Error("Please use a strong password")
            }
        }
    },

    age:{
        type: Number,
        default:0,
        validate(value){
            if (value<0){
                throw new Error("Age should be positive")
            }
        }
        
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
}, {timestamps:true})

userSchema.methods.getAuthToken = async function(){
    const user = this 
    const token = authToken.sign({id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if (!user){
        throw Error("Unable to Login")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw Error("Unable to Login")
    }
    return user
}

userSchema.pre('save', async function(next){
    const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
        next()
    }
})

userSchema.pre('deleteOne', { document: true}, async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})
const User = mongoose.model('User', userSchema)


module.exports = User
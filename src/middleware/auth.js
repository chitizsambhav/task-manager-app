const jwt = require('jsonwebtoken')
const User = require('../models/users')


const auth = async (req,res,next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id:decoded.id, 'tokens.token':token})
        if (!user){
            throw Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({error: "Please Authenticate!"})
    }
}

module.exports = auth
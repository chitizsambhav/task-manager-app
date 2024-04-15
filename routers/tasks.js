const Task = require('../src/models/tasks')
const express = require('express')
const auth = require('../src/middleware/auth')

const router = express.Router()

router.post('/tasks', auth, async (req,res)=>{
   
    try{
        const task = new Task({
            ...req.body,
            owner: req.user._id
           })
        task.save()
        res.status(201).send("Task has been created")
    }
    catch(e){
        res.status(400).send(e) 
    }
})

router.get('/tasks', auth, async (req,res)=>{
    const match = {owner:req.user._id}
    const page = parseInt(req.query.page) || 1 // Number of tasks per page
    const pageSize = parseInt(req.query.pageSize) || 4 // Current page number
    const sortBy = {}
    if (req.query.sortBy!==undefined && req.query.completed !=='')
        {const substrings = req.query.sortBy.split(':');
        sortBy[substrings[0]] = substrings[1] === 'desc' ? -1 : 1;}
    

    if (req.query.completed!==undefined && req.query.completed !==''){
        match.completed = req.query.completed === 'true'
    }
    try{
        const val = await Task.find(match)
        .skip((page - 1) * pageSize) // Skip tasks for previous pages
        .limit(pageSize) // Limit the number of tasks per page
        .sort(sortBy)
        if (val.length === 0){
            return res.status(404).send()
        }
        res.status(200).send(val)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/deleteAll', auth, async(req,res)=>{
    try {
        const tasks = await Task.deleteMany({owner:req.user._id})
        console.log(tasks)
        if(tasks.deletedCount===0){
            return res.status(404).send(" Hi " + req.user.name + ", No Task has been created by you yet!")
        }
        res.status(200).send("Hi "+ req.user.name+ ", No of Tasks deleted: "+ tasks.deletedCount)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOneAndDelete({_id, owner:req.user._id})
        if (!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }
    catch (e){
        res.status(500).send(e)
    }
})


router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try{
        const val = await Task.findOne({_id, owner:req.user._id})
        if (!val){
            return res.status(404).send()
        }
        res.status(200).send(val)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async(req,res)=>{
    requestFields = Object.keys(req.body)
    allowedFields = ['description', 'completed']
    const isValid = requestFields.every((field)=>{
        return allowedFields.includes(field)
    })

    if (!isValid){
        return res.status(400).send("Given Field is not correct")
    }
    try{
        const task = await Task.findOne({_id : req.params.id, owner : req.user._id})
        if (!task){
            return res.status(404).send()
        }
        requestFields.forEach((field) => {
            task[field] = req.body[field]
        })
        // const val = await Task.findByIdAndUpdate(req.params.id, req.body, {runValidators:true, new:true})
        await task.save()
        res.status(200).send(task)
    }
    catch (e){
        res.status(500).send(e)
    }
})

module.exports = router
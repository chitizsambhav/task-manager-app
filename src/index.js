const express = require('express');
require("./db/mongoose")
const User = require("./models/users")
const Task = require("./models/tasks")
const userRouter = require('../routers/users')
const taskRouter = require('../routers/tasks')

const app = express()
const port = process.env.PORT

// app.use((req,res)=>{
//     res.status(503).send("The website is undergoing Maintainance. Sorry for the inconvineances")
// })


app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.listen(port, ()=>{
    console.log("Server is up and running on: " + port)
})
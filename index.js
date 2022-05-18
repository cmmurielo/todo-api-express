import express from "express";
import mongoose from "mongoose";
import Task from "./controllers/task.controller.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import User from "./models/user.model.js";

const app = express()
const port = 3000
const mongoAtlasUri = 'mongodb+srv://admin:<password>@cluster0.gbfnw.mongodb.net/todo?retryWrites=true&w=majority'

mongoose.connect(mongoAtlasUri)

app.use(express.json())
app.use(cors())

//AUTH
app.post('/api/auth', async (require, response) => {
    const {body} = require
    try {
        const isUser = await User.findOne({username: body.username})
        if (isUser) {
            return response.status(403).send('El usuario ya existe.')
        }
        const salt = await bcrypt.genSalt()
        const hashed = await bcrypt.hash(body.password, salt)
        const user = await User.create({username: body.username, password: hashed, salt})
        response.sendStatus(200)
    } catch (e) {
        console.log(e)
        response.status(500).send(e.message)
    }
})

//TASK
app.get('/api/', Task.list)
app.get('/api/:id', Task.get)
app.post('/api/', Task.create)
app.put('/api/:id', Task.update)
app.delete('/api/:id', Task.delete)

app.listen(port, () => {
    console.log('La app esta corriendo');
})

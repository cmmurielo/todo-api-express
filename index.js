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
const mongoAtlasUri = 'mongodb+srv://admin:<PASSWORD>@cluster0.gbfnw.mongodb.net/todo?retryWrites=true&w=majority'
mongoose.connect(mongoAtlasUri)

app.use(express.json())
app.use(cors())

const signToken = _id => jwt.sign({_id}, 'mi-secreto')

//AUTH
app.post('/api/auth', async (req, res) => {
    const {body} = req
    try {
        const isUser = await User.findOne({username: body.username})
        if (isUser) {
            return res.status(403).send('El usuario ya existe.')
        }
        const salt = await bcrypt.genSalt()
        const hashed = await bcrypt.hash(body.password, salt)
        const user = await User.create({username: body.username, password: hashed, salt})
        const signed = signToken(user._id)
        res.status(200).send(signed)
    } catch (e) {
        console.log(e)
        response.status(500).send(e.message)
    }
})

//LOGIN
app.post('/api/login', async (req, res) => {
    const { body } = req
    try {
        const user = await User.findOne({username: body.username})
        if (!user) {
            res.send('Usuario o contrasena invalida')
        } else {
            const isMath = await bcrypt.compare(body.password, user.password)
            if (isMath) {
                const signed = signToken(user._id)
                res.status(200).send(signed)
            } else {
                res.status(403).send('Usuario o contrasena invalida')
            }
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//TASK
app.get('/api/', Task.list)
app.get('/api/:id', Task.get)
app.post('/api/', Task.create)
app.put('/api/:id', Task.update)
app.delete('/api/:id', Task.delete)

app.listen(port, () => {
    console.log('La app esta corriendo en el puerto ' + port );
})

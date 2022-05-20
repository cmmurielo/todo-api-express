import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import 'dotenv/config'
import cors from "cors";
import User from "./models/user.model.js";
import Task from "./controllers/task.controller.js";


const app = express()
const port = 3000
const mongoAtlasUri = 'mongodb+srv://admin:<password>@cluster0.gbfnw.mongodb.net/todo?retryWrites=true&w=majority'
mongoose.connect(mongoAtlasUri)

app.use(express.json())
app.use(cors())

const validateJwt = expressjwt({secret: process.env.SECRET_KEY, algorithms: ['HS256']})
const signToken = _id => jwt.sign({_id}, process.env.SECRET_KEY)
const findAndAssignUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth._id)
        if (!user){
            return res.status(401).end()
        }
        req.user = user
        next()
    } catch (e) {
        next(e)
    }
}
const isAuthenticated = express.Router().use(validateJwt, findAndAssignUser)

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
app.get('/api/', isAuthenticated,Task.list)
app.get('/api/:id', Task.get)
app.post('/api/', Task.create)
app.put('/api/:id', Task.update)
app.delete('/api/:id', Task.delete)

app.listen(port, () => {
    console.log('La app esta corriendo en el puerto ' + port );
})

import express from "express";
import mongoose from "mongoose";
import Task from "./controllers/task.controller.js";
import cors from "cors";

const app = express()
const port = 3000
const mongoAtlasUri = 'mongodb+srv://admin:<passwors>@cluster0.gbfnw.mongodb.net/todo?retryWrites=true&w=majority'

mongoose.connect(mongoAtlasUri)

app.use(express.json())
app.use(cors())

app.get('/api/', Task.list)
app.get('/api/:id', Task.get)
app.post('/api/', Task.create)
app.put('/api/:id', Task.update)
app.path('/api/:id', Task.update)
app.delete('/api/:id', Task.delete)

app.listen(port, () => {
    console.log('La app esta corriendo');
})

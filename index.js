import express from "express";
import mongoose from "mongoose";
import Task from "./controllers/task.controller.js";

const app = express()
const port = 3000
const mongoAtlasUri = 'mongodb+srv://admin:QW5f12jFKpDixVgw@cluster0.gbfnw.mongodb.net/todo?retryWrites=true&w=majority'

mongoose.connect(mongoAtlasUri)

app.use(express.json())

app.get('/', Task.list)
app.get('/:id', Task.get)
app.post('/', Task.create)
app.put('/:id', Task.update)
app.path('/:id', Task.update)
app.delete('/:id', Task.delete)

app.listen(port, () => {
    console.log('La app esta corriendo');
})
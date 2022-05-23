import mongoose from "mongoose";

const Task = mongoose.model('Task', {
    title : String,
    date: Date,
    state: Number,
    user : String
})

export default Task
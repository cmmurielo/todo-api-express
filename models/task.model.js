import mongoose from "mongoose";

const Task = mongoose.model('Task', {
    title : String,
    date: Date,
    state: Number
})

export default Task
import Tasks from "../models/task.model.js"

const Task = {
    list: async (req, res) => {
        let tasks = await Tasks.find()
        res.status(200).send(tasks)
    },

    listByUser: async (req, res) => {
        let {user} = req.params
        let task = await Tasks.find({user: user})
        res.status(200).send(task)
    },

    get: async (req, res) => {
        let {id} = req.params
        let task = await Tasks.findOne({_id: id})
        res.status(200).send(task)
    },

    create: async (req, res) => {
        let task = new Tasks(req.body)
        let saveTask = await task.save()
        res.status(201).send(saveTask._id)
    },
    update: async (req, res) => {
        let {id} = req.params
        let task = await Tasks.findOne({_id: id})
        Object.assign(task, req.body)
        await task.save()
        res.sendStatus(204)
    },
    delete: async (req, res) => {
        let {id} = req.params
        let task = await Tasks.findOne({_id: id})
        if (task) {
            task.remove()
        }
        res.sendStatus(204)
    },
}
export default Task
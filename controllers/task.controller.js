import Tasks from "../models/task.model.js"

const Task = {
    list: async (req, res) => {
        let users = await Tasks.find()
        res.status(200).send(users)
    },
    get: async (req, res) => {
        let {id} = req.params
        let task = await Tasks.findOne({_id: id})
        res.status(200).send(task)
    },
    create: async (req, res) => {
        let user = new Tasks(req.body)
        let saveUser = await user.save()
        res.status(201).send(saveUser._id)
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
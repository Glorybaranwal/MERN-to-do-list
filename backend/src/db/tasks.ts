import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title:{type:String, required: true},
    description:{type:String, required:true},
    status:{type:String, required:true},
    userId:{type:String}
    }
)

export const TaskModel = mongoose.model('task', TaskSchema);

export const getTaskList = () => TaskModel.find();
export const getTaskByTitle = (title: string) => TaskModel.findOne({title});
export const getTasksByUserId = (userId: string) => TaskModel.find({ userId }).lean().exec();
export const createTask = (values: Record<string, any>) => new TaskModel(values).save().then((task) => task.toObject());
export const deleteTaskById = (taskId: string, userId: string) => TaskModel.findOneAndDelete({ _id: taskId, userId }).exec();
export const updateTaskById = (taskId: string, userId: string, values: Record<string, any>) => TaskModel.findOneAndUpdate({ _id: taskId, userId }, values, { new: true }).exec();

import express from 'express'

import {deleteTask, getAllTaskList, updateTask} from '../controllers/tasks'
import { isAuthenticated } from '../middlewares'
import { createTaskList } from '../controllers/tasks'

export default(router:express.Router) => {
    router.get('/task', getAllTaskList)
    router.post('/task', createTaskList)
    router.delete('/task', deleteTask); // Changed to use DELETE with body
    router.put('/task', updateTask); // Changed to use PUT with body
}
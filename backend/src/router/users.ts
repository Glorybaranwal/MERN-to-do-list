import express from 'express'

import { deleteUser, getAllUsers } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
 router.get('/users', getAllUsers)
 router.delete('/users',isAuthenticated, deleteUser)
//  router.put('/users/:id', isAuthenticated, isOwner, updateUser)
 }
import express from 'express'
import { deleteUserById, getUserById, getUsers } from '../db/users'

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        const users= await getUsers()
        return res.status(200).json(users)

    } catch(error:any){
        console.log(error)
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.body;

        if (!id) {
            console.error("User ID not provided in request body");
            return res.sendStatus(400).json({ error: "User ID is required" });
        }

        const user = await getUserById(id);

        if (!user) {
            console.warn(`User with ID ${id} not found`);
            return res.status(404).json({ error: "User not found" });
        }

        await deleteUserById(id);
        console.log(`User with ID ${id} successfully deleted`);

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params
        const {username} = req.body

        if(!username){
            return res.sendStatus(404).json({"message":"Hahahaha"})
        }

        const user = await getUserById(id)
        user.username = username;
        await user.save()

        return res.status(200).json(user).end()

    } catch(error:any){
        console.log(error)
        return res.sendStatus(400).json({"message":"Hahahaha"})
    }
}
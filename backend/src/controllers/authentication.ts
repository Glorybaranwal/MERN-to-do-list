import express from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { getUserByEmail, createUser } from "../db/users";
import { authentication, random } from "../helpers";
import { UserModel } from "../db/users";

const secret = 'secret';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt

        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ userID: user._id, userEmail: email }, secret);
        res.status(200).json({ message: "User Registered", token, name: user.username });

    } catch (error: any) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.password');

        if (!user) {
            return res.sendStatus(400);
        }

        const isMatch = await bcrypt.compare(password, user.authentication.password);

        if (!isMatch) {
            return res.sendStatus(403);
        }

        const token = jwt.sign({ userID: user._id, userEmail: user.email }, secret);
        res.status(200).json({ message: "User Logged In", token, name: user.username });

    } catch (error: any) {
        console.log(error);
        return res.sendStatus(400);
    }
};

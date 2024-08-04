import express from 'express'
import {get, merge} from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req:express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {id} = req.params;
        const currentUserId = get(req, 'identity._id') as string
        if(!currentUserId){
            return res.sendStatus(403).json({"message":"Hihihi"})
        }
        if(currentUserId !== id){
            return res.sendStatus(403).json({"message":"Hahahaha"})
        }
        next()
    } catch(error){
        console.log(error)
        return res.sendStatus(400).json({"message":"Hahahaha"})
    }
}


export const isAuthenticated = async (req:express.Request, res: express.Response, next: express.NextFunction) => {
    try{

        const sessionToken = req.cookies['AUTH'];

        if(!sessionToken){
            return res.sendStatus(403).json({"message":"Hahahaha"})
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
            return res.sendStatus(403).send("hi")
        }

        merge(req, {identity: existingUser});

        return next();

    } catch(error) {
      console.log(error)
      return res.sendStatus(400).json({"message":"Hahahaha"})
    }
}
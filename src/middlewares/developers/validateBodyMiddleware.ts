import { NextFunction, Request, Response } from "express";

const validateDeveloperBodyMiddleware =  (req:Request, res: Response, next: NextFunction) =>{
    
    const keys = Object.keys(req.body);
    const requiredKeys = ["name", "email"];
    
    let validatedKeys: boolean = requiredKeys.every((key: string) => keys.includes(key)) 

    if(!validatedKeys){
        return res.status(400).json({
            "message": `Missing required keys: ${requiredKeys}`
        })
    }
    if(typeof req.body.name !== "string"){
        return res.status(400).json({ 
            "message" : "Name must be a string!"
        })
    }
    if(typeof req.body.email !== "string"){
        return res.status(400).json({ 
            "message" : "Email must be a string!"
        })
    }

    next()
   
}

export default validateDeveloperBodyMiddleware
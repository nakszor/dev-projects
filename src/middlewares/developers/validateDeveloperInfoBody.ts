import { NextFunction, Request, Response } from "express";

const validateDeveloperInfoBodyMiddleware =  (req:Request, res: Response, next: NextFunction) =>{
   
    const keys = Object.keys(req.body);
    const requiredKeys = ["preferredOS", "developerSince"];
    
    let validatedKeys: boolean = requiredKeys.every((key: string) => keys.includes(key)) 

    if(!validatedKeys){
        return res.status(400).json({
            "message": `Missing required keys: ${requiredKeys}`
        })
    }
    if(typeof req.body.developerSince !== "string"){
        return res.status(400).json({ 
            "message" : "PreferredOS must be a string!"
        })
    }
    if(typeof req.body.preferredOS !== "string"){
        return res.status(400).json({ 
            "message" : "developerSince must be a date!"
        })
    }

    next()
   
}

export default validateDeveloperInfoBodyMiddleware
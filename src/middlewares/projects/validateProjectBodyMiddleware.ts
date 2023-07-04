import { NextFunction, Request, Response } from "express";

const validateProjectBodyMiddleware =  (req:Request, res: Response, next: NextFunction) =>{
    
    const keys = Object.keys(req.body);
    const requiredKeys = ["name", "description", "estimatedTime", 
    "repository", "startDate", "developerId"];
    
    let validatedKeys: boolean = requiredKeys.every((key: string) => keys.includes(key)) 

    if(!validatedKeys){
        return res.status(400).json({
            "message": `Missing required keys: ${requiredKeys}`
        })
    }

    next()
   
}

export default validateProjectBodyMiddleware
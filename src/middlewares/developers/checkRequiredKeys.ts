import { NextFunction, Request, Response } from "express";
const checkDeveloperRequiredKeys = (req:Request, res: Response, next: NextFunction) => {

    const {name, email} = req.body 

    if(!name && !email){

        return res.status(400).json({
          "message": "At least one of those keys must be sent.",
          "keys": [ "name", "email" ]
        });
    }
    
    next()
}
export default checkDeveloperRequiredKeys;
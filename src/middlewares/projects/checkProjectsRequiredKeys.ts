import { NextFunction, Request, Response } from "express";
const checkProjectsRequiredKeys = (req:Request, res: Response, next: NextFunction) => {

    const {name,
    description,
    estimatedTime,
    repository,
    startDate,
    endDate,
    developerId} = req.body 

    if(!name && !description && !estimatedTime && !repository && !startDate && !endDate && !developerId ){

        return res.status(400).json({
            "message": "At least one of those keys must be send.",
            "keys": [
                "name",
                "description",
                "estimatedTime",
                "repository",
                "startDate",
                "endDate",
                "developerId"
            ]
        });
    }
    
    next()
}
export default checkProjectsRequiredKeys;
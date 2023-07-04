import { NextFunction, Request, Response } from "express";
const checkInfoRequiredKeys = (req:Request, res: Response, next: NextFunction) => {

const { developerSince, preferredOS } = req.body;

  if (!developerSince && !preferredOS) {
    return res.status(400).json({
      "message": "At least one of those keys must be send.",
      "keys": [ "developerSince", "preferredOS" ]
  });
  
}   
  
  next()

}

export default checkInfoRequiredKeys;
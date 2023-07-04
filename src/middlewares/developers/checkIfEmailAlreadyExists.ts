import { NextFunction, Request, Response } from "express";
import { QueryConfig } from 'pg'
import { iDeveloperResult } from "../../interfaces/developer.interfaces";
import { client } from '../../database'

const checkIfEmailAlreadyExists = async (req:Request, res:Response, next: NextFunction):Promise<Response | void> => {

    const email: string = req.body.email

    const queryString: string = `
    SELECT
        *
    FROM
        developers
    WHERE
        "email" = $1;
`
        const queryConfig: QueryConfig = {
        text: queryString,
        values: [email]
    }

    const queryResult: iDeveloperResult = await client.query(queryConfig)
    
    if(queryResult.rowCount){

        return res.status(409).json({
            "message": "Email already registered!"
          })
    }

 next()

} 

export default checkIfEmailAlreadyExists
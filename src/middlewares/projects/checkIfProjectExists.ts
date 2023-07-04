import { NextFunction, Request, Response } from "express";
import { QueryConfig } from 'pg'
import { client } from '../../database'

const checkIfProjectExists = async (req: Request, res: Response, next: NextFunction):Promise<Response | void> => {
    
 const id = req.params.id
 
    const findDeveloperQuery: QueryConfig = {
        text: 'SELECT * FROM projects WHERE "id" = $1',
        values: [id],
      };

      const developerResult = await client.query(findDeveloperQuery);
  
      if (developerResult.rows.length === 0) {

        return res.status(404).json({ 
          message: 'Project not found' 
        });
      }


  next()
    
} 
export default checkIfProjectExists
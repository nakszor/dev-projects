import { Request, Response } from 'express';
import { client } from '../database';
import { QueryConfig, QueryResult } from 'pg'
import { iDeveloperRequest, iDeveloperResult } from '../interfaces/developer.interfaces';

const create = async (req:Request, res: Response): Promise<Response> => {
  
  try {

    const {name, email} = req.body

    const newDeveloper: iDeveloperRequest = {name, email}

    const queryString: string = `
      INSERT INTO 
        developers("name", "email")
      VALUES 
        ($1, $2)
      RETURNING *;
    `
    const queryConfig: QueryConfig = {
      text: queryString,
      values: Object.values(newDeveloper) 
    }

    const queryResult: iDeveloperResult = await client.query(queryConfig)

    return res.status(201).json(queryResult.rows[0])

  } 

  catch (error) {

    console.error(error)

    return res.status(500).json({ 
      "message": "An error occurred while creating the developer!" })

  }
}

const read = async (req: Request, res: Response): Promise<Response> => {

  try {
      const queryString: string = `
        SELECT 
          d."id" AS "developerID", 
          d."name" AS "developerName", 
          d."email" AS "developerEmail", 
          di."id" AS "developerInfoID", 
          di."developerSince" AS "developerInfoDeveloperSince", 
          di."preferredOS" AS "developerInfoPreferredOS"
        FROM developers d
        LEFT JOIN developer_infos di ON d."developerInfoId" = di."id";
      `;
      const queryResult: QueryResult = await client.query(queryString);

      const developers = queryResult.rows;

      return res.status(200).json(developers);
    } 
    catch (error) {

    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
    }
};

const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
  
    let queryString = 'UPDATE developers SET ';      
    let values: Array<string | number> = [];
    let valueIndex = 1;
  
    if (name) {
      queryString += `name = $${valueIndex}, `;
      values.push(name);
      valueIndex++;
    }
  
    if (email) {
      queryString += `email = $${valueIndex}, `;
      values.push(email);
      valueIndex++;
    }
  
    queryString = queryString.slice(0, -2);
  
    queryString += ` WHERE id = $${valueIndex} RETURNING *;`;
    values.push(id);
  
    const result = await client.query(queryString, values);
      
    return res.status(200).json(result.rows[0]);

  } 
  catch (error) {
      console.error(error);

      return res.status(500).json({ message: 'Internal server error' });

  }
};

const deleteDeveloper = async ({developerResult}: Request, res: Response): Promise<Response> => {
   
  const id: number = developerResult.id;
  
    try {
   
      const findDeveloperInfoQuery: QueryConfig = {
        text: 'SELECT * FROM developer_infos WHERE id = $1',
        values: [developerResult.developerInfoId],
      };
      const developerInfoResult = await client.query(findDeveloperInfoQuery);
  
      if (developerInfoResult.rows.length !== 0) {

        const deleteDeveloperInfoQuery: QueryConfig = {
          text: 'DELETE FROM developer_infos WHERE id = $1',
          values: [developerResult.developerInfoId],
        };
        await client.query(deleteDeveloperInfoQuery);
      }
  
      const deleteDeveloperQuery: QueryConfig = {
        text: 'DELETE FROM developers WHERE id = $1',
        values: [id],
      };
      await client.query(deleteDeveloperQuery);
  
      return res.sendStatus(204);
    } 
    catch (error) {
      
      console.error(error);

      return res.status(500).json({
         message: 'Failed to delete developer.' 
        });
    }
};
  
export default { create, read, update, deleteDeveloper }
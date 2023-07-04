import { Request, Response } from 'express';
import { client } from '../database';
import { QueryConfig } from 'pg'
import { iDeveloperResult } from '../interfaces/developer.interfaces';

const create = async (req: Request, res: Response): Promise<Response> => {
 
  const id: number = req.developerResult.id;
  
  const { developerSince, preferredOS } = req.body;

  const queryString: string = `
    INSERT INTO developer_infos("developerSince", "preferredOS")
    VALUES ($1, $2)
    RETURNING *
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerSince, preferredOS],
  };

  try {
    const result = await client.query(queryConfig);
    const developerInfo = result.rows[0];

    const updateQuery: QueryConfig = {
      text: 'UPDATE developers SET "developerInfoId" = $1 WHERE developers."id" = $2',
      values: [developerInfo.id, id],
    };

    await client.query(updateQuery);

    return res.status(201).json(developerInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      "message": "Failed to create developer info." 
    });
  }
};

const read = async ({developerResult}:Request, res: Response): Promise<Response> =>{

    const id:number = developerResult.id

      const queryString: string = `
      SELECT d."id", d."name", d."email", di.*
      FROM developers d
      LEFT JOIN developer_infos di ON d."developerInfoId" = di."id"
      WHERE d."id" = $1
      `;
      const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
      }
    const queryResult: iDeveloperResult = await client.query(queryConfig)
      
    console.log(queryResult.rows[0])
    return res.status(200).json(queryResult.rows[0]);

}

const update = async (req: Request, res: Response): Promise<Response> => {

  const id: number = req.developerResult.id;

  const {developerSince, preferredOS} = req.body
  
  try {
  
    const updateValues: any[] = [];

    let queryString: string = 'UPDATE developer_infos SET ';

    let valueIndex = 1;

    if (developerSince) {
      queryString += '"developerSince" = $' + valueIndex + ', ';
      updateValues.push(developerSince);
      valueIndex++;
    }
    if (preferredOS) {
      queryString += '"preferredOS" = $' + valueIndex + ', ';
      updateValues.push(preferredOS);
      valueIndex++;
    }

    queryString = queryString.slice(0, -2); 

    queryString += ' WHERE developer_infos."id" IN (SELECT developers."developerInfoId" FROM developers WHERE developers."id" = $' + valueIndex + ') RETURNING *';

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [...updateValues, id],
    };
  
    const result = await client.query(queryConfig);
    const developerInfo = result.rows[0];
  
    return res.status(200).json(developerInfo);
  } 
  catch (error) {

    console.error(error);
    
    return res.status(500).json({ 
      "message": "Failed to update developer information."
    });
  }
};

export default {create, read, update}
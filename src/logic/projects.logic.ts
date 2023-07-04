import { Request, Response } from 'express';
import { client } from '../database';
import { QueryConfig, QueryResult } from 'pg'

const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      name,
      description,
      estimatedTime,
      repository,
      startDate,
      developerId,
      endDate = null, 
    } = req.body;

    const newProject = {
      name,
      description,
      estimatedTime,
      repository,
      startDate,
      endDate,
      developerId,
    };

    const queryString: string = `
      INSERT INTO 
        projects("name", "description", "estimatedTime", 
          "repository", "startDate", "endDate","developerId")
      VALUES 
        ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: Object.values(newProject),
    };

    const queryResult = await client.query(queryConfig);

    return res.status(201).json(queryResult.rows[0]);
  } 
  catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "An error occurred while creating the project!",
    });
  }
};
const read = async (req: Request, res: Response): Promise<Response> => {

  try {
      const queryString: string = `
      SELECT
      p."id" AS "projectID",
      p."name" AS "projectName",
      p."description" AS "projectDescription",
      p."estimatedTime" AS "projectEstimatedTime",
      p."repository" AS "projectRepository",
      p."startDate" AS "projectStartDate",
      p."endDate" AS "projectEndDate",
      p."developerId" AS "projectDeveloperID",
      t."id" AS "technologyID",
      t."name" AS "technologyName"
    FROM
      projects p
      LEFT JOIN projects_technologies pt ON p."id" = pt."projectId"
      LEFT JOIN technologies t ON pt."technologyId" = t."id";
    
    `;
      const queryResult: QueryResult = await client.query(queryString);

      const projects = queryResult.rows;

      console.log(projects)
      return res.status(200).json(projects);
    } 
    catch (error) {

    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
    }
};
const retrieve = async (req:Request, res: Response): Promise<Response> =>{

  const id:string = req.params.id

    const queryString: string = `
    SELECT
    p."id" AS "projectID",
    p."name" AS "projectName",
    p."description" AS "projectDescription",
    p."estimatedTime" AS "projectEstimatedTime",
    p."repository" AS "projectRepository",
    p."startDate" AS "projectStartDate",
    p."endDate" AS "projectEndDate",
    p."developerId" AS "projectDeveloperID",
    t."id" AS "technologyID",
    t."name" AS "technologyName"
  FROM
    projects p
    LEFT JOIN projects_technologies pt ON p."id" = pt."projectId"
    LEFT JOIN technologies t ON pt."technologyId" = t."id"
  WHERE
    p."id" = $1;
  
    `;
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id]
    }
  const queryResult  = await client.query(queryConfig)
    
  
  return res.status(200).json(queryResult.rows);

}
const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      estimatedTime,
      repository,
      startDate,
      endDate,
      developerId
    } = req.body;

    let queryString = 'UPDATE projects SET ';      
    let values: Array<string | number> = [];
    let valueIndex = 1;

    if (name) {
      queryString += `"name" = $${valueIndex}, `;
      values.push(name);
      valueIndex++;
    }

    if (description) {
      queryString += `"description" = $${valueIndex}, `;
      values.push(description);
      valueIndex++;
    }

    if (estimatedTime) {
      queryString += `"estimatedTime" = $${valueIndex}, `;
      values.push(estimatedTime);
      valueIndex++;
    }

    if (repository) {
      queryString += `"repository" = $${valueIndex}, `;
      values.push(repository);
      valueIndex++;
    }

    if (startDate) {
      queryString += `"startDate" = $${valueIndex}, `;
      values.push(startDate);
      valueIndex++;
    }

    if (endDate) {
      queryString += `"endDate" = $${valueIndex}, `;
      values.push(endDate);
      valueIndex++;
    }

    if (developerId) {
      queryString += `"developerId" = $${valueIndex}, `;
      values.push(developerId);
      valueIndex++;
    }

    queryString = queryString.slice(0, -2);

    queryString += ` WHERE id = $${valueIndex} RETURNING *;`;

    values.push(id);

    const result = await client.query(queryString, values);

    return res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Internal server error' });

  }
};
const deleteProject = async (req: Request, res: Response): Promise<Response> => {
  
  try {
    const projectId = req.params.id;

    const queryString = `
      DELETE FROM projects
      WHERE id = $1
      RETURNING *;
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [projectId],
    };

    const queryResult = await client.query(queryConfig);

    if (queryResult.rowCount === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.sendStatus(204);
  } 
  catch (error) {

    console.error(error);

    return res.status(500).json({ message: 'Internal server error' });
  }
};
const retrieveProjectsByDeveloper = async (req: Request, res: Response): Promise<Response> =>{
  
  const id:string = req.params.id

  const queryString: string = `
  SELECT 
  d."id" AS "developerID",
  d."name" AS "developerName",
  d."email" AS "developerEmail",
  di."id" AS "developerInfoID",
  di."developerSince" AS "developerInfoDeveloperSince",
  di."preferredOS" AS "developerInfoPreferredOS",
  p."id" AS "projectID",
  p."name" AS "projectName",
  p."description" AS "projectDescription",
  p."estimatedTime" AS "projectEstimatedTime",
  p."repository" AS "projectRepository",
  p."startDate" AS "projectStartDate",
  p."endDate" AS "projectEndDate",
  t."id" AS "technologyId",
  t."name" AS "technologyName"
FROM developers d
  LEFT JOIN developer_infos di ON d."developerInfoId" = di."id"
  LEFT JOIN projects p ON p."developerId" = d.id
  LEFT JOIN projects_technologies pt ON pt."projectId" = p."id"
  LEFT JOIN technologies t ON t."id" = pt."technologyId"
WHERE d."id" = $1;

  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id]
  }
const queryResult = await client.query(queryConfig)
  


return res.status(200).json(queryResult.rows);
  
}
const addTechnologyToProject = async (req: Request, res: Response): Promise<Response> => {
  
  const { projectId, technologyName } = req.body;

  try {
    const projectQueryConfig: QueryConfig = {
      text: 'SELECT * FROM projects WHERE id = $1',
      values: [projectId],
    };

    const projectResult = await client.query(projectQueryConfig);

    if (projectResult.rowCount === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const technologyQueryConfig: QueryConfig = {
      text: 'SELECT * FROM technologies WHERE name = $1',
      values: [technologyName],
    };

    const technologyResult = await client.query(technologyQueryConfig);

    if (technologyResult.rowCount === 0) {
      return res.status(400).json({
        "message": "Technology not supported.",
        "options": [
            "JavaScript",
            "Python",
            "React",
            "Express.js",
            "HTML",
            "CSS",
            "Django",
            "PostgreSQL",
            "MongoDB"
        ]
    });
    }

    const technology = technologyResult.rows[0];

    const projectTechnologyQueryConfig: QueryConfig = {
      text: 'INSERT INTO projects_technologies("AddedIn", "projectId", "technologyId") VALUES ($1, $2, $3) RETURNING *',
      values: [new Date(), projectId, technology.id],
    };

    const projectTechnologyResult = await client.query(projectTechnologyQueryConfig);
    const projectTechnology = projectTechnologyResult.rows[0];

    const project = projectResult.rows[0];

    const response = {
      technologyId: technology.id,
      technologyName: technology.name,
      projectId: project.id,
      projectName: project.name,
      projectDescription: project.description,
      projectEstimatedTime: project.estimatedTime,
      projectRepository: project.repository,
      projectStartDate: project.startDate,
      projectEndDate: project.endDate,
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to add technology to project' });
  }
};


export default {create, 
  read, 
  retrieve, 
  update, 
  deleteProject, 
  retrieveProjectsByDeveloper, 
  addTechnologyToProject}


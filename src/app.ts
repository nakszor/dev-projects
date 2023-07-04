import 'dotenv/config';
import express, { Application, json } from 'express';
import { databaseInit } from './database';
import {developersInfoLogic, developersLogic, projectsLogic} from "./logic/index"
import { checkIfEmailAlreadyExists, 
  validateDeveloperInfoBodyMiddleware, 
  validateDeveloperBodyMiddleware,
  checkDeveloperRequiredKeys,
  checkInfoRequiredKeys,
  checkIfUserExists } from './middlewares/developers'
import {validateProjectBodyMiddleware, 
        ensureDeveloperExists,
        checkIfProjectExists,
        checkProjectRequiredKeys} from './middlewares/projects'

const app: Application = express();
app.use(json());

//Developers and infos routes 
app.post("/developers", validateDeveloperBodyMiddleware, checkIfEmailAlreadyExists, developersLogic.create)
app.post("/developers/:id/infos", checkIfUserExists, validateDeveloperInfoBodyMiddleware, developersInfoLogic.create)

app.get("/developers", developersLogic.read)
app.get("/developers/:id", checkIfUserExists, developersInfoLogic.read)

app.patch("/developers/:id/infos", checkIfUserExists, checkInfoRequiredKeys, developersInfoLogic.update)
app.patch("/developers/:id", checkIfUserExists, checkDeveloperRequiredKeys,checkIfEmailAlreadyExists,developersLogic.update)

app.delete("/developers/:id", checkIfUserExists,developersLogic.deleteDeveloper)

// Projects and technologies
app.post("/projects", ensureDeveloperExists, validateProjectBodyMiddleware,projectsLogic.create )
app.get("/projects", projectsLogic.read)

app.get("/projects/:id", checkIfProjectExists, projectsLogic.retrieve)
app.patch("/projects/:id", checkIfProjectExists, checkProjectRequiredKeys, projectsLogic.update)

app.delete("/projects/:id", checkIfProjectExists, projectsLogic.deleteProject)

app.get("/developers/:id/projects", checkIfUserExists, projectsLogic.retrieveProjectsByDeveloper)

app.post("/projects/:id/technologies", checkIfProjectExists ,projectsLogic.addTechnologyToProject)

const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, async (): Promise<void> => {
  await databaseInit();
  console.log(`App running on port ${PORT}`);
});
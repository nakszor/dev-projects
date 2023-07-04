import { QueryResult } from "pg";
interface iDeveloperRequest {
    name: string;
    email: number;
}
interface iDeveloper {
    id: number;
    name: string;
    email: string;
    developerInfoID: number;  
}

type iDeveloperResult = QueryResult<iDeveloper>

export { iDeveloper, iDeveloperResult, iDeveloperRequest }
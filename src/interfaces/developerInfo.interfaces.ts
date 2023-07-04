import { QueryResult } from "pg";

interface IDeveloperInfoRequest {
    "developerSince": Date;
    "preferredOS": string;
}
interface IDeveloperInfo{
  "developerInfoID": number;
  "developerInfoDeveloperSince": Date;
  "developerInfoPreferredOS": string;
}

type IDeveloperInfoResult = QueryResult<IDeveloperInfo>

export {IDeveloperInfo, IDeveloperInfoRequest, IDeveloperInfoResult}
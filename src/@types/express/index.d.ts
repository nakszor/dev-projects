import * as express from 'express'

declare global {
  namespace Express {
    interface Request {
      developerResult: {
        id: number;
        name: string;
        email: string;
        developerInfoId: number | null;
    } 
   }
  }
 }
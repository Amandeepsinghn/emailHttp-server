import { Request, Response } from "express";
export declare const getAllData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const scanResume: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSingleResume: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLatestScore: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=atsController.d.ts.map
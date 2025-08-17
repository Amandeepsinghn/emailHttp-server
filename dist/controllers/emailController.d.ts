import { Request, Response } from "express";
export declare const emailSender: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const uploadResume: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const formalTone: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const pdfBody: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=emailController.d.ts.map
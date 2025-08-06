import { Request, Response } from "express";
import { z } from "zod";
export declare const signUpBody: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const logInBody: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const signUp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logIn: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const dashboardInfo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const blogsInfo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=loginController.d.ts.map
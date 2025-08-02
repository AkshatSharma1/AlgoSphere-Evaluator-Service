import { z, ZodError } from "zod";
// import { CreateSubmissionDto } from "../dtos/CreateSubmissionDto";
import { NextFunction, Request, Response } from "express";

//For global validator donot use type as <CreateSubmissionDto> instead user <any>
export const validate = (schema: z.Schema<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Parse the request body directly.
        schema.parse(req.body); 
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            // 2. Use status 400 for validation errors and send the specific issues.
            console.log(error)
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                data: {},
                errors: error,
            });
        }
        // For any other unexpected errors, pass them to Express's error handler.
        next(error);
    }
}
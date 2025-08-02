import { Request, Response } from "express";
import { CreateSubmissionDto } from "../dtos/CreateSubmissionDto";

export const addSubmission = (req: Request, res: Response)=>{

    //validate req body
    const submissionDto = req.body as CreateSubmissionDto;

    //Do validation
    console.log("Sent the submission data");
    

    return res.status(201).json({
        success: true,
        error: {},
        message: "Successfully collected the submisssion",
        data: submissionDto
    })
}

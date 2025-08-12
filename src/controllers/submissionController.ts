import { Request, Response } from "express";
import { CreateSubmissionDto } from "../dtos/CreateSubmissionDto";

export const addSubmission = async (req: Request, res: Response) => {
    const submissionDto: CreateSubmissionDto = req.body;
    console.log("hello",submissionDto)

    // The test cases are hardcoded for now, as requested.
    // const submissionPayload: SubmissionPayload = {
    //     code: submissionDto.code,
    //     language: submissionDto.language,
    //     inputCase: "10\n20", 
    // };

    // const payload = {
    //     [submissionDto.problemId]: submissionPayload
    // };

    return res.status(201).json({
        success: true,
        message: "Successfully collected the submission",
        data: submissionDto,
        error: {},
    });

};
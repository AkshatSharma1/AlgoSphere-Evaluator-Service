import express from "express";
import { addSubmission } from "../../controllers/submissionController";
import { validate } from "../../validators/createSubmissionValidator";
import { createSubmissionZodSchema } from "../../dtos/CreateSubmissionDto";

const submssionRouter = express.Router();

submssionRouter.post('/', validate(createSubmissionZodSchema),addSubmission);

export default submssionRouter;
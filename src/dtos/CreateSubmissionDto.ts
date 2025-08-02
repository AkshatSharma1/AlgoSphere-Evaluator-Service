import * as z from "zod"

// export interface CreateSubmissionDto{
//     userId: string,
//     problemId: string,
//     code: string,
//     language: string
// }

//Create schema using zod schema
export type CreateSubmissionDto = z.infer<typeof createSubmissionZodSchema>;

//Using zod to create zod schema
//Creating createSubmission schema
export const createSubmissionZodSchema = z.object({
    userId: z.string(),
    problemId: z.string(),
    code: z.string(),
    language: z.string()
});
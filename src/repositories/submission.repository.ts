import Submission from '../models/submission.model';

class SubmissionRepository {
    async updateStatus(submissionId: string, status: string, output?: string) {
        try {
            const updatedSubmission = await Submission.findByIdAndUpdate(
                submissionId,
                { status: status, output: output },
                { new: true }
            );
            return updatedSubmission;
        } catch (error) {
            console.error("Error updating submission status in DB:", error);
            throw error;
        }
    }
}

export default SubmissionRepository;
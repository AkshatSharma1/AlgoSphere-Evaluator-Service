import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    problemId: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Success", "Wrong Answer", "Time Limit Exceeded", "Compilation Error", "Runtime Error"],
        default: "Pending"
    }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
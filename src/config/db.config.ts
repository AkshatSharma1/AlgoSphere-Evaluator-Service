import mongoose from 'mongoose';
import serverConfig from './serverConfig';

export const connectDB = async () => {
    try {
        if (!serverConfig.PROD_DB_URL) {
            throw new Error("Submission DB URL not found in environment variables.");
        }
        await mongoose.connect(serverConfig.PROD_DB_URL);
        console.log("✅ Successfully connected to Submission DB.");
    } catch (error) {
        console.error("❌ Failed to connect to Submission DB.", error);
        process.exit(1); // Exit the process with failure code
    }
};
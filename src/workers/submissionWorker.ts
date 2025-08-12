// src/workers/submissionWorker.ts

import { Job, Worker } from "bullmq";
import redisConnection from "../config/redisConfig";
import SubmissionJob from "../Jobs/SubmissionJob";

export default function submissionWorker(queueName: string) {
    console.log(`🚀 Initializing worker for queue: ${queueName}`);

    const worker = new Worker(queueName, async (job: Job) => {
        console.log(`✅ ----> Received a new job with ID: ${job.id}`);
        if (job.name === "SubmissionJob") {
            const submissionJobInstance = new SubmissionJob(job.data);
            return submissionJobInstance.handle(job);
        }
    }, { connection: redisConnection });

    worker.on('completed', (job, returnValue) => {
        console.log(`✅ Submission Job ${job.id} completed successfully. Result:`, returnValue);
    });

    worker.on('failed', (job, err) => {
        console.error(`❌ Submission Job ${job?.id} failed with error: ${err.message}`);
    });

    worker.on('error', err => {
        console.error('Submission worker encountered an error:', err);
    });

    worker.on('ready', () => {
        console.log('✅ Worker is ready and connected to Redis.');
    });
}
//Consumer: Here we will define what to do with a particular queue, which operation to run
import { Job, Worker } from "bullmq";
import { WorkerResponse } from "../types/bullMqWorkerResponse";
import { IJob } from "../types/bullMqJobDefn";
import SampleJob from "../Jobs/SampleJob";

//Setup connection
import redisConnection from "../config/redisConfig";

export default function sampleWorker(queueName: string){
    const worker = new Worker<IJob, WorkerResponse>(queueName, async(job:Job):Promise<WorkerResponse>=>{
        
        //do some work
        console.log("Worker is running", job);

        //check for jobs
        if(job.name === "SampleJob"){
            const sampleJobInstance = new SampleJob(job.data);
            sampleJobInstance.handle();

            return {status: 200, message: "Sample Job executed successfully"};
        }

        throw new Error(`Unknown job name: ${job.name}`)
    },{connection: redisConnection})

    console.log(worker);
    

    worker.on('completed', (job, returnValue) => {
        console.log(`✅ Job ${job.id} completed successfully. Return value:`, returnValue);
    });

    worker.on('failed', (job, err) => {
        console.error(`❌ Job ${job?.id} failed with error: ${err.message}`);
    });

    worker.on('error', err => {
        console.error('Worker encountered an error:', err);
    });
}
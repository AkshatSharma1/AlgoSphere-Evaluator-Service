import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefn";

export default class SampleJob implements IJob{
    //class name will be same as job name which is passed, so get it from this object
    name: string;
    payload: Record<string, unknown>;
    constructor(payload: Record<string, unknown>){
        this.payload = payload;
        this.name = this.constructor.name;
    }

    //functions
    handle = (job?:Job) => {
        //handle the job
        console.log('Handler of job');
        if(job){
            console.log(job.name, job.id, job.data);
            
        }
    }

    failed = (job?:Job): void => {
        console.log("job failed")
        if(job){
            console.log(job.id)
        }
    }
}
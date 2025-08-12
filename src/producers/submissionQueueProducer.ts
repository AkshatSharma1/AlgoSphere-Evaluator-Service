//Adding jobs into the queue
import submissionQueue from "../queues/submissionQueue";

export default async function(name: string, payload: Record<string, unknown>){
    //add the job into a queue
    await submissionQueue.add(name, payload);
    console.log("Successfully added a new job");
    
}
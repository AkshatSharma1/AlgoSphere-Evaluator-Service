//Adding jobs into the queue
import sampleQueue from "../queues/sampleQueue";

export default async function(name: string, payload: Record<string, unknown>){
    //add the job into a queue
    await sampleQueue.add(name, payload)
}
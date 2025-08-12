import {createBullBoard} from "@bull-board/api"
import {BullMQAdapter} from "@bull-board/api/bullMQAdapter"
import {ExpressAdapter} from "@bull-board/express"
import sampleQueue from "../queues/sampleQueue";
import submissionQueue from "../queues/submissionQueue";

//Creating bull board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/dashboard')

createBullBoard({
queues: [new BullMQAdapter(sampleQueue), new BullMQAdapter(submissionQueue)],
serverAdapter: serverAdapter 
})

export default serverAdapter;



import {createBullBoard} from "@bull-board/api"
import {BullMQAdapter} from "@bull-board/api/bullMQAdapter"
import {ExpressAdapter} from "@bull-board/express"
import sampleQueue from "../queues/sampleQueue";

//Creating bull board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/dashboard')

createBullBoard({
queues: [new BullMQAdapter(sampleQueue)],
serverAdapter: serverAdapter 
})

export default serverAdapter;



import express, { Express } from 'express';

import serverConfig from './config/serverConfig';
import apiRouter from './routes';
import sampleQueueProducer from './producers/sampleQueueProducer';
import sampleWorker from './workers/sampleWorker';
sampleWorker("SampleJob");

const app: Express = express();

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at PORT ${serverConfig.PORT}`);

  //Initialize a worker listening for job with SampleJob name. It will listen everytime
  
  //Firing up a producer
  sampleQueueProducer("SampleJob",{
    name:"Akshat",
    goal: "Peaceful life"
  })

});

import express, { Express } from 'express';
import bodyParser from "body-parser"

import serverConfig from './config/serverConfig';
import apiRouter from './routes';
// import sampleQueueProducer from './producers/sampleQueueProducer';
import sampleWorker from './workers/sampleWorker';
import serverAdapter from './config/bullBoardConfig';
import runPython from './containers/runPythonDocker';

const app: Express = express();

//Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())


app.use('/api', apiRouter);
app.use('/dashboard', serverAdapter.getRouter()); //bull board route

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at PORT ${serverConfig.PORT}`);
  console.log(`Bullboard is live at: http://localhost:${serverConfig.PORT}/dashboard`)

  //Initialize a worker listening for job with SampleJob name. It will listen everytime
  sampleWorker("SampleQueue");

  //Run the container: for example purpose only here
  const code = `x = input()
  y = input()
  print("value of x is", x)
  print("value of y is", y)`;

  const testCases = `100
  200`
  runPython(code, testCases);

  //Firing up a producer
  // sampleQueueProducer("SampleJob",{
  //   name:"Akshat",
  //   goal: "Peaceful life"
  // })

});

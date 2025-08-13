import express, { Express } from 'express';
import bodyParser from "body-parser"

import serverConfig from './config/serverConfig';
import apiRouter from './routes';
// import sampleQueueProducer from './producers/sampleQueueProducer';
// import sampleWorker from './workers/sampleWorker';
import serverAdapter from './config/bullBoardConfig';
// import runPython from './containers/runPythonDocker';
import submissionWorker from './workers/submissionWorker';
import { connectDB } from './config/db.config';
import cors from 'cors';

const app: Express = express();

//Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())
app.use(cors())


app.use('/api', apiRouter);
app.use('/dashboard', serverAdapter.getRouter()); //bull board route

(async () => {
  try {
    await connectDB(); // Ensure DB connection is established first
    
    // Start the worker only after the DB connection is successful
    submissionWorker("SubmissionQueue");

    app.listen(serverConfig.PORT, () => {
      console.log(`Server started at PORT ${serverConfig.PORT}`);
      console.log(`Bullboard is live at: http://localhost:${serverConfig.PORT}/dashboard`);
    });

  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1); // Exit if initialization fails
  }
})();

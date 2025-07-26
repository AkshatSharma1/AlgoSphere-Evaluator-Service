import express, { Express } from 'express';

import serverConfig from './config/serverConfig';

const app: Express = express();

app.listen(serverConfig.PORT, () => {
  const s: number = 10;
  console.log(s);
  console.log(`Server started at PORT ${serverConfig.PORT}`);
});

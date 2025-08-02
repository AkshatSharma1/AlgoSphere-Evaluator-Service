import express from 'express';

import { pingCheck } from '../../controllers/pingController';
import submssionRouter from './submissionRouter';

const v1Router = express.Router();

v1Router.use('/submissions', submssionRouter);
v1Router.get('/ping', pingCheck);

export default v1Router;

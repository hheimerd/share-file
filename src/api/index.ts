/* eslint-disable @typescript-eslint/no-var-requires*/
import type {Express} from 'express';
import {getAllFiles} from '@/api/endpoints/all-files';
import AsyncRouter from '@/types/restyped/typed-express';
import type {Api} from '@/api/api-declaration';

const express = require('express');
const cors = require('cors');

export function start() {
  const expressApp = express() as Express;

  expressApp.use(cors());

  const router = AsyncRouter<Api>(expressApp);

  router.get('/all-files', async () => {
    return getAllFiles();
  });

  expressApp.listen(3001, '0.0.0.0', console.log);
}

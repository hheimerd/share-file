import type {Express} from 'express';
import {getAllFiles} from '@/api/endpoints/all-files';
import AsyncRouter from '@/types/restyped/typed-express';
import type {Api} from '@/api/api-declaration';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

export function start() {
  const expressApp = express() as Express;

  const router = AsyncRouter<Api>(expressApp);

  router.get('/all-files', async () => {
    return getAllFiles();
  });

  expressApp.listen(3001, '0.0.0.0', console.log);
}

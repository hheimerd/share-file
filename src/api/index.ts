/* eslint-disable @typescript-eslint/no-var-requires*/
import type {Express} from 'express';
import {getAllFiles, getDirContent, getFile} from '@/api/endpoints/descriptors';
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

  router.get('/dir-content/:id', async (req) => {
    return await getDirContent(req.params.id);
  });

  router.get('/file/:id', async (req, res) => {
    const file = await getFile(req.params.id);
    if (!file)
      throw new Error('Not found');

    res.type(file.type);
    return file.stream();
  });

  expressApp.listen(3001, '0.0.0.0', console.log);
}

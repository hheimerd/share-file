
import type {Express} from 'express';
import {getAllFiles} from '@/api/endpoints/all-files';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

export function start() {
  const expressApp = express() as Express;

  expressApp.get('/all-files', (req, res) => {
    res.json(getAllFiles());
  });

  expressApp.listen(3001, '0.0.0.0');
}

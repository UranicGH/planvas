/* eslint-disable no-throw-literal, no-magic-numbers */
import bodyParser from 'body-parser';
import chalk from 'chalk';
import dateformat from 'dateformat';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dirApi = `${path.resolve(path.dirname(fileURLToPath(import.meta.url)))}/api`;

const router = express.Router(),
  app = express(),
  port = 3000,
  context = '/api';

// In-memory mock database
const assignments = [];

let loadedAdditional = false;

async function load(dir) {
  const files = fs.readdirSync(dir);
  await files.reduce(async (acc, file) => {
    await acc; // Wait for previous iterations to resolve.

    const filePath = `${path.resolve(`${dir}/${file}`)}`,
      fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      await load(filePath);
    } else if (fileStat.isFile()) {
      const { path: importPath, router: importRouter } = await import(filePath);
      router.use(importPath, importRouter);
      console.log('Loaded:', importPath);
      loadedAdditional = true;
    }
  }, Promise.resolve([]));
}

await load(dirApi);

if (loadedAdditional) {
  console.log(); // Put a blank line before the listening message.
}

app.use(bodyParser.json({ limit: '10mb' }));

app.use('/*', (req, res, next) => {
  const formattedDate = dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss');
  console.log(
    chalk.grey(`[${formattedDate}]`),
    chalk.cyanBright.bold(req.method),
    chalk.greenBright(req.originalUrl)
  );
  next();
});

// Add routes to handle assignments
router.get('/assignments', (req, res) => {
  res.json(assignments);
});

router.post('/assignments', (req, res) => {
  const newAssignment = {
    id: Date.now(),
    ...req.body,
  };

  assignments.push(newAssignment);
  res.status(201).json(newAssignment); // Send created assignment back as a response
});

app.use(context, router);

// Error handler
app.use((err, req, res, next) => {
  console.error(
    chalk.redBright('Error:'),
    chalk.red(err)
  );
  res
    .status(500)
    .json({ success: false, error: err.message || 'Internal Server Error' });
});

app.listen(port, () =>
  console.log(`Listening at http://localhost:${port}${context}\n`)
);

/* eslint-disable no-throw-literal, no-magic-numbers */
import chalk from 'chalk';
import express from 'express';
import moment from 'moment';

const path = '/assignment',
  router = express.Router();

export { path, router };

const baseMoment = moment(1651848210524).startOf('hour');
let hours = 1;

const assignment = [
  { 'id': 1, 'subject': 'cs370', 'date': baseMoment.valueOf(), 'details': 'Some details here.' },
  { 'id': 2, 'subject': 'cs370', 'date': baseMoment.add(hours, 'hour').valueOf() },
  { 'id': 3, 'subject': 'cs370', 'date': baseMoment.add(hours += 2, 'hour').valueOf(), 'details': 'Some extra long details here that have a lot of extra text so that it can check text overflow.' },
  { 'id': 4, 'subject': 'cs370', 'date': baseMoment.add(hours += 1, 'hour').valueOf(), 'details': 'Some details here.' },
  { 'id': 5, 'subject': 'cs370', 'date': baseMoment.add(hours += 3, 'hour').valueOf() },
  { 'id': 6, 'subject': 'cs370', 'date': baseMoment.add(hours += 3, 'hour').valueOf() },
  { 'id': 7, 'subject': 'cs370', 'date': baseMoment.add(hours += 1, 'hour').valueOf(), 'details': 'Some details here.' },
  { 'id': 8, 'subject': 'cs370', 'date': baseMoment.add(hours += 3, 'hour').valueOf() },
  { 'id': 9, 'subject': 'cs370', 'date': baseMoment.add(hours += 8, 'hour').valueOf(), 'details': 'Some extra long details here that have a lot of extra text so that it can check text overflow.' },
  { 'id': 10, 'subject': 'cs370', 'date': baseMoment.add(hours += 2, 'hour').valueOf(), 'details': 'Some details here.' },
  { 'id': 11, 'subject': 'cs370', 'date': baseMoment.add(hours += 3, 'hour').valueOf(), 'details': 'Some details here.' },
  { 'id': 12, 'subject': 'cs370', 'date': baseMoment.add(hours += 2, 'hour').valueOf() },
  { 'id': 13, 'subject': 'cs370', 'date': baseMoment.add(hours += 6, 'hour').valueOf(), 'details': 'Some extra long details here that have a lot of extra text so that it can check text overflow.' },
  { 'id': 14, 'subject': 'cs370', 'date': baseMoment.add(hours += 1, 'hour').valueOf() },
  { 'id': 15, 'subject': 'cs370', 'date': baseMoment.add(hours += 1, 'hour').valueOf(), 'details': 'Some details here.' },
  { 'id': 16, 'subject': 'cs370', 'date': baseMoment.add(hours += 9, 'hour').valueOf(), 'details': 'Some extra long details here that have a lot of extra text so that it can check text overflow.' },
  { 'id': 17, 'subject': 'cs370', 'date': baseMoment.add(hours += 3, 'hour').valueOf() },
  { 'id': 18, 'subject': 'cs370', 'date': baseMoment.add(hours += 2, 'hour').valueOf() },
  { 'id': 19, 'subject': 'cs370', 'date': baseMoment.add(hours += 1, 'hour').valueOf(), 'details': 'Some details here.' },
  { 'id': 20, 'subject': 'cs370', 'date': baseMoment.add(hours += 1, 'hour').valueOf() },
  { 'id': 21, 'subject': 'cs370', 'date': baseMoment.add(hours += 1, 'hour').valueOf() },
  { 'id': 22, 'subject': 'cs370', 'date': baseMoment.add(hours += 3, 'hour').valueOf() }
];

router.route('/')

  .get((req, res) => {
    const { page, pageSize } = req.query;

    if (!page || !pageSize) {
      throw 'Params page and pageSize must be defined.';
    }

    const start = (parseInt(page, 10) - 1) * parseInt(pageSize, 10),
      end = start + parseInt(pageSize, 10);

    res.json(assignment.slice(start, end));
  })

  .delete((req, res) => {
    if (!req.query.ids) {
      throw 'Nothing to delete.';
    }

    const { ids } = req.query,
      idList = (ids instanceof Array ? ids : [ ids ]).map(id => parseInt(id));

    idList.forEach(currentId => {
      const assignmentIndex = assignments.findIndex(assignment => assignment.id === currentId);
      if (assignmentIndex >= 0) {
        assignments.splice(assignmentIndex, 1);
      } else {
        console.warn(
          chalk.yellowBright('Warning:'),
          chalk.yellow('ID'),
          chalk.cyan(currentId),
          chalk.yellow('not found.')
        );
      }
    });

    res.end();
  })
  .post((req, res) => {
  if (!req.body) {
    throw 'Nothing to add.';
  }

  const assignment = req.body;

  if (!assignment.date) {
    throw "Property 'date' is required.";
  } else if (!assignment.subject) {
    throw "Property 'subject' is required.";
  }

  let newId = assignments.reduce(
    (maxId, currentassignment) => Math.max(maxId, currentassignment.id),
    0
  );
  assignment.id = ++newId;

  assignments.push(assignment);

  console.log(
    chalk.green('Added new assignment with ID:'),
    chalk.cyan(newId)
      .concat(chalk.green('.'))
  );

  res.json(assignment);
});

router.route('/total')

  .get((req, res) => {
    res.json({ total: assignments.length });
  });

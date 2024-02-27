const express = require('express');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config();

const authRouter = require('./routes/api/auth');
const contactsRouter = require('./routes/api/contacts');
const bpRouter = require('./routes/api/business-processes');
const bpCatalogRouter = require('./routes/api/business-process-catalog');
const subjectsRouter = require('./routes/api/subjects');
const subjectsRouterSelect = require('./routes/api/subjects-select');
const storesRouter = require('./routes/api/stores');
const financeRouter = require('./routes/api/finances');
const settingsRouter = require('./routes/api/settings');


const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/users', authRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/business-processes', bpRouter);
app.use('/api/business-processes-catalog', bpCatalogRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/subjects-select', subjectsRouterSelect);
app.use('/api/stores', storesRouter);
app.use('/api/finances', financeRouter);
app.use('/api/settings', settingsRouter);


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
})

app.use((err, req, res, next) => {
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({ message });
})

module.exports = app;

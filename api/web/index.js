const express = require('express')
const exitHook = require('async-exit-hook');
const { Pool } = require('pg')

const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

const endpoints = require('./endpoints');

/** Register Middleware  */
app.use(cors())
app.use(bodyParser.json())
app.use(function (req, res, next) {
  if (req.method !== 'GET' && req.header('Content-Type') !== 'application/json') {
    res.status(400).json({ message: 'Bad Content-Type, must be application/json' })
  } else {
    next()
  }
})
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    res.status(400).json({ message: 'Bad JSON', error })
  } else {
    next()
  }
});

/** Database */
let pool;
if (process.env['ENV'] === 'production') {
  pool = new Pool()
} else {
  pool = new Pool({
    user: 'grahamp',
    host: 'localhost',
    database: 'grahamp',
    password: '',
    port: 5432
  })
}

endpoints(app, pool);

/** Bootstrap */
app.listen(5000, () => console.log('Example app listening on port 5000!'))

exitHook((done) => {
  console.log('Closing Postgres connections...')
  pool.end()
    .then(() => {
      console.log('Bye!')
      done()
    })
})
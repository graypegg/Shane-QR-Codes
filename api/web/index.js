const express = require('express')
const exitHook = require('async-exit-hook');
const { Pool } = require('pg')

const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

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
async function query (...args) {
  const res = await pool.query(...args)
  return res
}

/** Router */
app.get('/', (req, res) => {
  query(`
    SELECT *
    FROM saves
    ORDER BY id
    DESC LIMIT 1;
  `).then((response) => {
    res.json(response.rows[0])
  }).catch((error) => {
    console.error(error);
    res.status(500).json({ message: 'DB did something weird' })
  })
})

app.post('/', (req, res) => {
  const data = JSON.stringify(req.body)
  query(`
    INSERT INTO saves (data)
    VALUES ($1)
    RETURNING id;
  `, [data]).then((response) => {
    res.json({ id: response.rows[0].id })
  }).catch((error) => {
    console.error(error);
    res.status(500).json({ message: 'DB did something weird' })
  })
})

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
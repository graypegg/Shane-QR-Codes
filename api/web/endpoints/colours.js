const jwt = require('express-jwt');
const colours = require('../colours.json');

module.exports = (app, pool) => {
  app.get('/colours.json',
    async (req, res) => {
      res.json(colours);
    }
  )

  app.post('/colours',
    jwt({ secret: 'ailurus' }),
    async (req, res) => {
      if (req.body.colour && colours[req.body.colour]) {
        await pool.query(
          `
            INSERT INTO "colours"("colour", "user_id") VALUES($1, $2) RETURNING "id";
          `, [
            req.body.colour,
            req.user.id
          ]
        ).then((response) => {
          res.json({ id: response.rows[0].id })
        });
      } else {
        res.status(400).json({ message: 'bad colour' });
      }
    }
  )
}
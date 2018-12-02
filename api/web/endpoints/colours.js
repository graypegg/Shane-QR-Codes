const jwt = require('express-jwt');
const colours = require('../colours.json');

module.exports = (app, pool) => {
  app.get('/colours.json',
    async (req, res) => {
      res.json(colours);
    }
  )

  app.post('/colours/:colourId',
    jwt({ secret: 'ailurus' }),
    async (req, res) => {
      if (req.params.colourId && colours[parseInt(req.params.colourId)]) {
        try {
          await pool.query(
            `
              INSERT INTO "colours"("colour", "user_id") VALUES($1, $2) RETURNING "id";
            `, [
              req.params.colourId,
              req.user.id
            ]
          ).then((response) => {
            res.json({ id: response.rows[0].id })
          });
        } catch (e) {
          console.error(e);
          if (e.code === '23505') res.status(400).json({ message: `colour #${req.params.colourId} already selected for this user` });
          else res.status(500).json({ message: 'Something went horribly wrong' });
        }
      } else {
        res.status(400).json({ message: 'bad colour' });
      }
    }
  )

  app.delete('/colours/:colourId',
    jwt({ secret: 'ailurus' }),
    async (req, res) => {
      if (req.params.colourId) {
        try {
          const { rowCount } = await pool.query(
            `
              DELETE FROM "colours" WHERE "colour"=$1 AND "user_id"=$2;
            `, [
              req.params.colourId,
              req.user.id
            ]
          );
          if (rowCount) res.json({ message: 'deleted.' });
          else res.status(400).json({ message: 'that colour is not selected for this user' });
        } catch (e) {
          console.error(e);
          if (e.code === '23505') res.status(400).json({ message: `colour #${req.body.colour} already selected for this user` });
          else res.status(500).json({ message: 'Something went horribly wrong' });
        }
      } else {
        res.status(400).json({ message: 'no colour param' });
      }
    }
  )
}
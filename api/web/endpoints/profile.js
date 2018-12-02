const colours = require('../colours.json');

module.exports = (app, pool) => {
  app.get('/profile/:username', async (req, res) => {
    if (req.params.username) {
      try {
        const { rows } = await pool.query(
          `
            SELECT colours.colour FROM users
            INNER JOIN colours ON users.id = colours.user_id
            WHERE users.username = $1
          `, [
            req.params.username
          ]
        );
        res.json({
          colours: rows.map((colourRow) => ({ 
            ...colours[colourRow.colour],
            id: colourRow.colour
          }))
        });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Something went horribly wrong' });
      }
    } else {
      res.status(400).json({ message: 'no colour param' });
    }
  })
}
const bcrypt = require('bcrypt');

module.exports = (app, pool) => {
  app.post('/new', async (req, res) => {
    if (!req.body.password) {
      res.status(400).json({ message: 'no password' });
      return 0;
    }
    if (!req.body.username) {
      res.status(400).json({ message: 'no username' });
      return 0;
    }
    try {
      const hash = await new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (errSalt, salt) => {
          if (errSalt) reject(errSalt);
          else bcrypt.hash(req.body.password, salt, (errHash, hash) => {
            if (errHash) reject(errHash);
            else resolve(hash);
          });
        });
      });
      await pool.query(
        `
          INSERT INTO "users"("username", "password") VALUES($1, $2) RETURNING "id";
        `, [
          req.body.username,
          hash
        ]
      ).then((response) => {
        res.json({ id: response.rows[0].id })
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.toString() })
    }
  })
}
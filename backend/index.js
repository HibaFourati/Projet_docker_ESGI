const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion PostgreSQL via variables d'environnement
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'filmdb',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASS || 'password',
});

// Créer la table au démarrage si elle n'existe pas
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS films (
      id SERIAL PRIMARY KEY,
      titre VARCHAR(255) NOT NULL,
      type VARCHAR(50) DEFAULT 'film',
      genre VARCHAR(100),
      note INTEGER CHECK (note >= 0 AND note <= 10),
      avis TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('Table films prête');
};

// GET /films → liste tous les films
app.get('/films', async (req, res) => {
  const result = await pool.query('SELECT * FROM films ORDER BY created_at DESC');
  res.json(result.rows);
});

// POST /films → ajouter un film
app.post('/films', async (req, res) => {
  const { titre, type, genre, note, avis } = req.body;
  const result = await pool.query(
    'INSERT INTO films (titre, type, genre, note, avis) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [titre, type, genre, note, avis]
  );
  res.status(201).json(result.rows[0]);
});

// PUT /films/:id → modifier la note
app.put('/films/:id', async (req, res) => {
  const { id } = req.params;
  const { note, avis } = req.body;
  const result = await pool.query(
    'UPDATE films SET note = $1, avis = $2 WHERE id = $3 RETURNING *',
    [note, avis, id]
  );
  res.json(result.rows[0]);
});

// DELETE /films/:id → supprimer un film
app.delete('/films/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM films WHERE id = $1', [id]);
  res.status(204).send();
});

// Démarrage
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await initDB();
  console.log(`Backend démarré sur le port ${PORT}`);
});

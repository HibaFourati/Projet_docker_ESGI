CREATE TABLE IF NOT EXISTS films (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'film',
  genre VARCHAR(100),
  note INTEGER CHECK (note >= 0 AND note <= 10),
  avis TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO films (titre, type, genre, note, avis) VALUES
  ('Inception', 'film', 'Science-Fiction', 9, 'Un chef-d''oeuvre de Nolan, mind-blowing'),
  ('Breaking Bad', 'série', 'Thriller', 10, 'La meilleure série de tous les temps'),
  ('Interstellar', 'film', 'Science-Fiction', 9, 'Visuellement époustouflant'),
  ('The Office', 'série', 'Comédie', 8, 'Humour subtil, attachant'),
  ('Parasite', 'film', 'Drame', 10, 'Palme d''or méritée, un bijou');

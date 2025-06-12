const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

// Configuração do Banco de Dados
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'tarefasdb',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
});

// Função para criar a tabela se não existir
const inicializarDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tarefas (
        id SERIAL PRIMARY KEY,
        descricao TEXT NOT NULL,
        concluida BOOLEAN DEFAULT FALSE
      );
    `);
    console.log('Tabela "tarefas" verificada/criada com sucesso.');
  } catch (err) {
    console.error('Erro ao criar tabela:', err);
    // Tenta reconectar ou sai se for crítico
    process.exit(1);
  }
};

// --- Endpoints do CRUD ---

// CREATE
app.post('/api/tarefas', async (req, res) => {
  const { descricao } = req.body;
  try {
    const novaTarefa = await pool.query(
      'INSERT INTO tarefas (descricao) VALUES ($1) RETURNING *',
      [descricao]
    );
    res.status(201).json(novaTarefa.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get('/api/tarefas', async (req, res) => {
  try {
    const tarefas = await pool.query('SELECT * FROM tarefas ORDER BY id');
    res.json(tarefas.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/api/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, concluida } = req.body;
  try {
    const tarefaAtualizada = await pool.query(
      'UPDATE tarefas SET descricao = $1, concluida = $2 WHERE id = $3 RETURNING *',
      [descricao, concluida, id]
    );
    res.json(tarefaAtualizada.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete('/api/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
    res.status(204).send(); // Sem conteúdo
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Interface Gráfica ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Porta da aplicação - vamos usar 8242
const PORT = 8242;
app.listen(PORT, async () => {
  await inicializarDB();
  console.log(`Servidor rodando na porta ${PORT}`);
});
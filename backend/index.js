const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Rotas para usuários
app.get('/usuarios', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/usuarios', (req, res) => {
    const { name, points, referred_by } = req.body;
    db.run('INSERT INTO users (name, points, referred_by) VALUES (?, ?, ?)', [name, points, referred_by], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name, points, referred_by });
    });
});

// Rotas para motos
app.get('/motos', (req, res) => {
    db.all('SELECT * FROM bikes', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/motos', (req, res) => {
    const { user_id, model, year } = req.body;
    db.run('INSERT INTO bikes (user_id, model, year) VALUES (?, ?, ?)', [user_id, model, year], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, user_id, model, year });
    });
});

// Rotas para serviços
app.get('/servicos', (req, res) => {
    db.all('SELECT * FROM services', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/servicos', (req, res) => {
    const { bike_id, service_name } = req.body;
    db.run('INSERT INTO services (bike_id, service_name) VALUES (?, ?)', [bike_id, service_name], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, bike_id, service_name });
    });
});

// Rotas para mecânicos
app.get('/mecanicos', (req, res) => {
    db.all('SELECT * FROM mechanics', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/mecanicos', (req, res) => {
    const { name } = req.body;
    db.run('INSERT INTO mechanics (name) VALUES (?)', [name], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name });
    });
});

// Rotas para relacionar serviços e mecânicos
app.post('/servicos-mecanicos', (req, res) => {
    const { service_id, mechanic_id } = req.body;
    db.run('INSERT INTO service_mechanics (service_id, mechanic_id) VALUES (?, ?)', [service_id, mechanic_id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ service_id, mechanic_id });
    });
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;



//PERMITIR DETERMINADAS URLS
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  
  app.use(cors(corsOptions));
  





// Defina o caminho do banco de dados
const dbPath = path.resolve(__dirname, 'database.sqlite');
const dbExists = fs.existsSync(dbPath);

// Conecte-se ao banco de dados (o arquivo será criado se não existir)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Se o banco de dados não existir, crie as tabelas
if (!dbExists) {
    db.serialize(() => {
        console.log('Criando tabelas...');

        // Criação da tabela de usuários
        db.run(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER,
                gender TEXT,
                email TEXT,
                phone TEXT,
                points INTEGER DEFAULT 0,
                referred_by INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'active',
                FOREIGN KEY(referred_by) REFERENCES users(id)
            )
        `);

        // Criação da tabela de motos
        db.run(`
            CREATE TABLE motorcycles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                brand TEXT NOT NULL,
                model TEXT NOT NULL,
                year INTEGER NOT NULL,
                engine_capacity INTEGER,
                color TEXT,
                vin TEXT,
                purchase_date DATETIME,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);

        // Criação da tabela de serviços
        db.run(`
            CREATE TABLE services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                motorcycle_id INTEGER NOT NULL,
                service_name TEXT NOT NULL,
                description TEXT,
                mileage INTEGER,
                service_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                cost REAL,
                status TEXT DEFAULT 'pending',
                FOREIGN KEY(motorcycle_id) REFERENCES motorcycles(id)
            )
        `);

        // Criação da tabela de mecânicos
        db.run(`
            CREATE TABLE mechanics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER,
                specialty TEXT,
                years_of_experience INTEGER
            )
        `);

        // Criação da tabela de associação entre serviços e mecânicos
        db.run(`
            CREATE TABLE service_mechanics (
                service_id INTEGER NOT NULL,
                mechanic_id INTEGER NOT NULL,
                PRIMARY KEY (service_id, mechanic_id),
                FOREIGN KEY(service_id) REFERENCES services(id),
                FOREIGN KEY(mechanic_id) REFERENCES mechanics(id)
            )
        `);

        // Criação da tabela de indicações
        db.run(`
            CREATE TABLE user_referrals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                referrer_id INTEGER NOT NULL,
                referred_id INTEGER NOT NULL,
                referral_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(referrer_id) REFERENCES users(id),
                FOREIGN KEY(referred_id) REFERENCES users(id)
            )
        `);

        console.log('Tabelas criadas com sucesso.');
    });
}


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
    const { name, age, gender, email, phone, points, referred_by } = req.body;
    db.run('INSERT INTO users (name, age, gender, email, phone, points, referred_by) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, age, gender, email, phone, points, referred_by], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name, age, gender, email, phone, points, referred_by });
    });
});

// Rota para adicionar uma indicação
app.post('/indicar', (req, res) => {
    const { referrer_id, referred_id } = req.body;

    // Adiciona a indicação à tabela user_referrals
    db.run('INSERT INTO user_referrals (referrer_id, referred_id) VALUES (?, ?)', [referrer_id, referred_id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Atualiza os pontos do usuário que fez a indicação
        db.run('UPDATE users SET points = points + 10 WHERE id = ?', [referrer_id], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            res.status(201).json({ referrer_id, referred_id });
        });
    });
});

// Rota para ver pontos de um usuário
app.get('/pontos/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.get('SELECT points FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.json({ points: row.points });
    });
});

// Rota para ver todas as indicações feitas por um usuário
app.get('/indicacoes/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.all('SELECT * FROM user_referrals WHERE referrer_id = ?', [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Rotas para motos
app.get('/motos', (req, res) => {
    db.all('SELECT * FROM motorcycles', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/motos', (req, res) => {
    const { user_id, brand, model, year, engine_capacity, color, vin, purchase_date } = req.body;
    db.run('INSERT INTO motorcycles (user_id, brand, model, year, engine_capacity, color, vin, purchase_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [user_id, brand, model, year, engine_capacity, color, vin, purchase_date], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, user_id, brand, model, year, engine_capacity, color, vin, purchase_date });
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
    const { motorcycle_id, service_name, description, mileage, service_date, cost, status } = req.body;
    db.run('INSERT INTO services (motorcycle_id, service_name, description, mileage, service_date, cost, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [motorcycle_id, service_name, description, mileage, service_date, cost, status], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, motorcycle_id, service_name, description, mileage, service_date, cost, status });
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
    const { name, age, specialty, years_of_experience } = req.body;
    db.run('INSERT INTO mechanics (name, age, specialty, years_of_experience) VALUES (?, ?, ?, ?)', [name, age, specialty, years_of_experience], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name, age, specialty, years_of_experience });
    });
});

// Rotas para associar serviços e mecânicos
app.post('/servicos-mecanicos', (req, res) => {
    const { service_id, mechanic_id } = req.body;
    db.run('INSERT INTO service_mechanics (service_id, mechanic_id) VALUES (?, ?)', [service_id, mechanic_id], function (err) {
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

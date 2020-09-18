require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const PORT = 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.json({ message: 'API OK' });
});

app.get('/cartoes', verificaJWT, (req, res, next) => {
    res.json([{id: 1, 'brand' : 'mastercard'}])
});

app.post('/login', (req, res, next) => {

    const { user, pwd } = req.body;

    console.log(`${user} ${pwd}`)

    if (user === 'admin' && pwd === 'admin') {
        const id = 1;

        let token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 300
        });

        return res.json({ auth: true, token: token })
    }

    res.status(500).json({ message: 'Login inválido' });
});

app.post('/logout', (req, res) => res.json({ auth: false, token: null }))


function verificaJWT(req, res, next) {
    let token = req.headers['x-access-token'];

    if (!token) return res.status(401).json({ auth: false, message: 'Nenhum token fornecido' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).json({ message: 'Falha na autenticação!' });

        req.userId = decoded.id;
        next();
    });
}

const server = http.createServer(app);
server.listen(PORT, () => console.log(`escutando porta ${PORT}`));
const express = require('express');
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 8080;

const CLIENTS = [
    {
        id: 1,
        firstname: 'SNOW',
        lastname: 'John'
    },
    {
        id: 2,
        firstname: 'DOE',
        lastname: 'John'
    },
    {
        id: 3,
        firstname: 'JOE',
        lastname: 'Jackie'
    }
];

app.get('/api/clients', (req, res) => {
    let clients = CLIENTS;
    if (req.query.sort_dir) {
        clients = clients.sort((a,b) => (req.query.sort_dir === 'asc') ? a.id - b.id : b.id - a.id );
    }
    console.log(`Get clients ${(req.query.sort_dir) ? `sorted by id ${req.query.sort_dir} ` : ''}!!`);
    res.status(200).json(CLIENTS);
});

app.get('/api/clients/:clientId', (req, res) => {
    const clientId = parseInt(req.params.clientId, 10);
    res.status(200).json(CLIENTS.filter(client => client.id === clientId));
});

app.post('/api/clients', (req, res) => {
    const body = req.body;
    CLIENTS.push({
        id: CLIENTS.length + 1,
        firstname: body.firstname,
        lastname: body.lastname
    });

    console.log(`Client ${JSON.stringify(CLIENTS[CLIENTS.length - 1])} created !`);
    res.status(201).json(CLIENTS[CLIENTS.length - 1]);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});
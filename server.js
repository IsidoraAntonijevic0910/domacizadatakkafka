const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io'); 

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  },
});
const clients = new Set();


app.post('/api/receive-data', (req, res) => {
    const receivedData = req.body;

    
    const jsonData = JSON.stringify(receivedData);
    clients.forEach(client => {
        client.send(jsonData);
    });
    
    res.status(200).send('Data received successfully');
});


io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    
    clients.add(socket);

    
    socket.on('disconnect', () => {
        console.log('WebSocket connection closed');
        clients.delete(socket);
    });
});


server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

// Lista para armazenar os líderes
let leaderboard = [];

io.on('connection', (socket) => {
    // Envia a lista de líderes ao cliente quando ele se conecta
    io.to(socket.id).emit('updateLeaderboard', leaderboard);

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

// Adicione a lógica para atualizar os líderes aqui (exemplo fictício)
function updateLeaderboard() {
    // Atualiza a lista de líderes (fictícia neste exemplo)
    leaderboard = [
        { name: 'Player1', coffees: 100 },
        { name: 'Player2', coffees: 80 },
        { name: 'Player3', coffees: 60 },
        // Adicione mais jogadores conforme necessário
    ];

    // Emite a atualização para todos os clientes conectados
    io.emit('updateLeaderboard', leaderboard);

    // Agende a próxima atualização (a cada 5 segundos neste exemplo)
    setTimeout(updateLeaderboard, 5000);
}

// Inicie o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Inicie a atualização inicial dos líderes
updateLeaderboard();

const socket = io('http://localhost:3000'); // ou a URL do seu servidor, se estiver usando outro

import { socket } from "./socket.js";
import { selectedWords, topic } from './words.js';
import { users } from "./receiver.js";

const startGameBtn = document.getElementById('startGameBtn');

// 메세지 전송
function selectLiar() {
    const word = selectRandomWord();
    // 랜덤한 유저 선택
    const liar = users[Math.floor(Math.random() * users.length)]
    socket.emit('message', JSON.stringify({ act: 'play', liar, topic, word }))
}
function checkActiveUser() {
    socket.emit('message', JSON.stringify({ act: 'check'}))
}

function selectRandomWord() {
    return selectedWords()[Math.floor(Math.random() * selectedWords().length)]
}
startGameBtn.addEventListener('click', selectLiar);


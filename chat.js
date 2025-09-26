import {categories, words} from './words.js';
const chatBox = document.getElementById('chatBox');

const startGameBtn = document.getElementById('startGameBtn');
const topicInput = document.getElementById('topicInput');
let myId = '';
let users = {}
let topic = categories[0];

const socket = io(`https://asdof.xyz/`, {query: {room: window.location.pathname}});
// const socket = io('http://localhost:3000/',  {query: {room: window.location.pathname}});
// 접속시 parsing된 본인 id 확인
socket.on('id', (data) => {
    myId = data
    document.getElementById('myId').innerText = myId
    console.log("referer:", socket);
})

// 메시지 수신
socket.on('message', (data) => {
    if(!data.msg.startsWith('{'))
        return
    displayMessage(data);
    scrollToBottom()
});
// 유저리스트 수신
socket.on('users', (data) => {
    users = data['users'];
    console.log(users)
})
// 메세지 전송
function selectLiar() {
    const word = selectRandomWord();
    // 랜덤한 유저 선택
    const liar = users[Math.floor(Math.random() * users.length)]
    const otherUsers = users.filter((id) => liar !== id)
    socket.emit('message', JSON.stringify({act: 'liar', to: liar, word: `${topic}`}))
    otherUsers.map(
        other => socket.emit('message', JSON.stringify({act: 'player', to: other, word: `${word}[${topic}]`}))
    )
    console.log(word)

}

function selectRandomWord() {
    const selectedWords =  words[topic]
    console.log(topic, selectedWords)
    return selectedWords[Math.floor(Math.random() * selectedWords.length)]
}

// Scroll to the bottom
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-text')
    messageContent.classList.add(className);
    messageContent.textContent = text;
    messageDiv.appendChild(messageContent);
    chatBox.appendChild(messageDiv);
}
// 메세지 노출
function displayMessage(data) {

    const msgObj = JSON.parse(data.msg);
    if(msgObj.act === 'liar' && myId === msgObj.to) {
        appendMessage(`당신은 라이어입니다. 주제 : ${msgObj.word}. 현재 인원: ${users.length}명.`, 'liar')
    }
    if(msgObj.act === 'player' && myId === msgObj.to) {
        appendMessage(`당신은 플레이어입니다. 단어: ${msgObj.word}. 현재 인원: ${users.length}명.`, 'player')
    }
}

startGameBtn.addEventListener('click', selectLiar);
topicInput.addEventListener('change', (e) => {
    topic = e.target.value;
})


import {socket} from "./socket.js";

export let users = {}

const chatBox = document.getElementById('chatBox');
const userList = document.getElementById('userList');
let myId = '';

// 접속시 parsing된 본인 id 확인
socket.on('id', (data) => {
    myId = data
    document.getElementById('myId').innerText = myId
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
    userList.textContent = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.append(li);
    })
})

// 메세지 노출
function displayMessage(data) {
    const msgObj = JSON.parse(data.msg);
    if(msgObj.act === 'liar' && myId === msgObj.to) {
        appendMessage(`당신은 라이어입니다. 주제 : ${msgObj.word}. 현재 인원: ${users.length}명.`, 'liar')
    }
    if(msgObj.act === 'player' && myId === msgObj.to) {
        appendMessage(`당신은 플레이어입니다. 단어: ${msgObj.word}. 현재 인원: ${users.length}명.`, 'player')
    }
    setWordNow(msgObj.word)
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
function setWordNow(word) {
    document.getElementById('wordNow').textContent = word
}


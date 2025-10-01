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
// check요청시 active 여부 응답
socket.on('check', (data) => {
    socket.emit('direct', {act: 'nickname', nick: 'test', active: true}, data.id)
})


// 메세지 노출
function displayMessage(data) {
    const msgObj = JSON.parse(data.msg);
    if(msgObj.liar === myId) {
        appendMessage(`당신은 라이어입니다. 주제 : ${msgObj.topic}. 현재 인원: ${users.length}명.`, 'liar')
        setWordNow(`비밀~ [${msgObj.topic}]`)
    } else {
        appendMessage(`당신은 플레이어입니다. 단어: ${msgObj.word} [${msgObj.topic}]. 현재 인원: ${users.length}명.`, 'player')
        setWordNow(`${msgObj.word} [${msgObj.topic}]`)
    }


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


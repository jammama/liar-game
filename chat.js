import { words } from './words.js';
const chatBox = document.getElementById('chatBox');

const startGameBtn = document.getElementById('startGameBtn');
const topicInput = document.getElementById('topicInput');
let myId = '';
let users = {}
let topic = '';

const socket = io(`https://asdof.xyz/`, {query: {room: window.location.pathname}});
// const socket = io('http://localhost:3000/',  {query: {room: window.location.pathname});
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
});
// 유저리스트 수신
socket.on('users', (data) => {
    users = data['users'];
    console.log(users)
})
// 메세지 전송
function selectLiar() {
    // 랜덤한 유저 선택
    const word = selectRandomWord();
    const liar = users[Math.random() * users.length]
    const otherUsers = users.filter((id) => liar !== id)
    socket.emit('message', JSON.stringify({act: 'liar', to: liar, word: word}))
    otherUsers.map(
        other => socket.emit('message', JSON.stringify({act: 'player', to: other, word: word}))
    )
    console.log(word)

}

function selectRandomWord() {
    const selectedWords =  words[topic] || words['food']
    console.log(topic, selectedWords)
    return selectedWords[Math.floor(Math.random() * selectedWords.length)]
}

// 메세지 노출
function displayMessage(data) {
    const msgObj = JSON.parse(data.msg);
    if(msgObj.act === 'liar' && myId === msgObj.to) {
       chatBox.textContent = `당신은 라이어입니다. 현재 인원수가 ${users.length}명이 맞는지 확인하세요.`
    }
    if(msgObj.act === 'player' && myId === msgObj.to) {
        chatBox.textContent = `당신은 플레이어입니다. 단어는 ${msgObj.word} 입니다. 
        현재 인원수가 ${users.length}명이 맞는지 확인하세요.`
    }
    console.log(msgObj, data)
}
startGameBtn.addEventListener('click', selectLiar);
topicInput.addEventListener('change', (e) => {
    topic = e.target.value;
})
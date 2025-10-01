let socketUrl = 'https://asdof.xyz/';
const url = new URL(window.location.href);
if (url.hostname === 'localhost'){
    socketUrl = 'http://localhost:3000/';
};
export const socket = io(socketUrl,  {query: {room: window.location.pathname}});
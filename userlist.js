// HTML: userListPopup, showUserListBtn, closeUserListBtn의 id와 정확히 맞아야 함
const showUserBtn = document.getElementById('showUserListBtn');
const popup = document.getElementById('userListPopup');
const closeUserBtn = document.getElementById('closeUserListBtn');

// 팝업 켜기
showUserBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
});

// 팝업 끄기
closeUserBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

// 팝업 바깥 눌러도 닫힘
popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.style.display = 'none';
});

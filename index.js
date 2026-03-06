// 1. インポートをブラウザで動く形式に修正
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, serverTimestamp } 
    from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    // ... あなたのFirebaseプロジェクト設定をここに入れる
    databaseURL: "https://chatapp-97496-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database, "chat_messages"); // これが必要！

/////////////////////////////////////////////////////////////
//HTML要素の取得
//送信ボタン
const sendButton = document.getElementById('sendButton');
//タイムライン
const timeMessages = document.getElementById('timeMessages');
//送信者
let myIdElement = document.getElementById('userFirst');
//ユーザ切り替えボタン
const userSwitchBtn = document.getElementById('userSwitchBtn');
/////////////////////////////////////////////////////////////

//送信処理
sendButton.addEventListener('click', function() {
    const sendMessage = document.getElementById('sendMessage');
    const msgText = sendMessage.value.trim();
    const myId = myIdElement.getAttribute('user_id');
    
    if(msgText !== "") {
        //dbにpush
        push(dbRef, {
            userId: myId,
            text: msgText,
            timestamp: serverTimestamp()
        });
        //メッセージを空に
        sendMessage.value = "";
    }
});

/////////////////////////////////////////////////////////////
// 受信処理（Firebaseにデータが増えたら自動実行）
onChildAdded(dbRef, (data) => {
    const msg = data.val();
    const myId = myIdElement.getAttribute('user_id');
    
    // 自分のメッセージ(1)か相手のかでクラスを切り替え
    const sideClass = (msg.userId === myId) ? "Right" : "Left";

    // 友達のHTML構造に合わせてメッセージを追加
    const msgHtml = `
        <div class="timeMessage message${sideClass}">
            <div class="messageBox">
                <div class="messageContent">
                    <div class="messageText">${msg.text}</div>
                </div>
            </div>
        </div>
        <div class="clear"></div>
    `;

    timeMessages.insertAdjacentHTML('beforeend', msgHtml);
    // 最新のメッセージまでスクロール
    timeMessages.scrollTo(0, timeMessages.scrollHeight);
});

//ユーザの切り替え
userSwitchBtn.addEventListener('click', function() {
    
    if(myIdElement.getAttribute('user_id') === "1") {
        myIdElement = document.getElementById('chatPartner');
        console.log('user1');
    } else {
        myIdElement = document.getElementById('userFirst');
        console.log('user2');
    }
    //myIdElement = document.getElementById((myIdElement.getAttribute('user_id') === 1) ? 'chatPartner' : 'userFirst');
});
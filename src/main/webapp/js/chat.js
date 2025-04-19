/**
 * Jakarta EEチャットアプリケーション用のフロントエンドScript
 */
document.addEventListener('DOMContentLoaded', function () {
    // DOM要素の参照を取得
    const loginPage = document.getElementById('loginPage');
    const chatPage = document.getElementById('chatPage');
    const usernameInput = document.getElementById('username');
    const loginButton = document.getElementById('loginButton');
    const loginStatus = document.getElementById('loginStatus');
    const messageArea = document.getElementById('messageArea');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const usersList = document.getElementById('usersList');
    const connectedUser = document.getElementById('connectedUser');
    const connectionStatus = document.getElementById('connectionStatus');
// DOM要素の取得
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');
const loginForm = document.getElementById('login-form');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const messageArea = document.getElementById('message-area');
const onlineUsers = document.getElementById('online-users');
const usernameInput = document.getElementById('username');
const logoutBtn = document.getElementById('logout-btn');

let username = null;
let webSocket = null;

// ログインフォームの送信処理
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    username = usernameInput.value.trim();
    if (username) {
        // ユーザー名が入力されたらWebSocket接続を開始
        connectToWebSocket();
    }
});

// メッセージフォームの送信処理
messageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const message = messageInput.value.trim();
    if (message && webSocket) {
        // メッセージを送信
        webSocket.send(message);
        messageInput.value = '';
    }
});

// ログアウトボタンのクリック処理
logoutBtn.addEventListener('click', function() {
    if (webSocket) {
        webSocket.close();
    }
});

// WebSocket接続を開始する関数
function connectToWebSocket() {
    // 現在のホスト名を取得してWebSocketのURLを構築
    const host = window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${host}/chatapp/chat/${username}`;
    
    // WebSocketに接続
    webSocket = new WebSocket(wsUrl);
    
    // 接続が開いたときの処理
    webSocket.onopen = function() {
        console.log('WebSocket接続が確立されました');
        // ログインページを隠してチャットページを表示
        loginPage.classList.remove('active');
        chatPage.classList.add('active');
    };
    
    // メッセージを受信したときの処理
    webSocket.onmessage = function(event) {
        const message = JSON.parse(event.data);
        handleReceivedMessage(message);
    };
    
    // エラーが発生したときの処理
    webSocket.onerror = function(error) {
        console.error('WebSocketエラー: ', error);
    };
    
    // 接続が閉じたときの処理
    webSocket.onclose = function() {
        console.log('WebSocket接続が閉じられました');
        // チャットページを隠してログインページを表示
        chatPage.classList.remove('active');
        loginPage.classList.add('active');
        // 入力欄をクリア
        messageInput.value = '';
        usernameInput.value = '';
        // メッセージエリアをクリア
        messageArea.innerHTML = '';
        // ユーザー名をリセット
        username = null;
    };
}

// 受信したメッセージを処理する関数
function handleReceivedMessage(message) {
    switch (message.type) {
        case 'JOIN':
            // ユーザー参加メッセージ
            addSystemMessage(message.content);
            break;
            
        case 'LEAVE':
            // ユーザー退出メッセージ
            addSystemMessage(message.content);
            break;
            
        case 'MESSAGE':
            // 通常のチャットメッセージ
            addChatMessage(message.sender, message.content);
            break;
            
        case 'USERS':
            // オンラインユーザーリスト
            updateOnlineUsers(message.users);
            break;
    }
    
    // 自動スクロールでメッセージエリアの最下部に移動
    messageArea.scrollTop = messageArea.scrollHeight;
}
/**
 * Jakarta EE WebSocketチャットアプリケーション
 * フロントエンドJavaScript
 */

// DOM要素
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const connectedUsername = document.getElementById('connected-username');
const logoutButton = document.getElementById('logout-button');
const messageArea = document.getElementById('message-area');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const onlineUsers = document.getElementById('online-users');

// メッセージ種別
const MESSAGE_TYPE = {
    CHAT: 'CHAT',
    JOIN: 'JOIN',
    LEAVE: 'LEAVE',
    USERS: 'USERS',
    ERROR: 'ERROR'
};

// WebSocketセッション
let webSocket = null;
let username = '';

// 初期化処理
window.onload = init;

function init() {
    // イベントリスナーの設定
    loginForm.addEventListener('submit', connect);
    logoutButton.addEventListener('click', disconnect);
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // フォーカス設定
    usernameInput.focus();
}

/**
 * WebSocket接続を確立する
 */
function connect(e) {
    e.preventDefault();

    username = usernameInput.value.trim();
    if (username === '') {
        alert('ユーザー名を入力してください');
        return;
    }

    // WebSocketエンドポイントへの接続URL
    const host = window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const wsUrl = `${wsProtocol}${host}${window.location.pathname}chat/${username}`;

    // WebSocket接続を開始
    webSocket = new WebSocket(wsUrl);

    // 接続イベントの設定
    webSocket.onopen = onOpen;
    webSocket.onmessage = onMessage;
    webSocket.onclose = onClose;
    webSocket.onerror = onError;
}

/**
 * 接続切断処理
 */
function disconnect() {
    if (webSocket !== null) {
        webSocket.close();
    }
}

/**
 * WebSocket接続確立時の処理
 */
function onOpen(event) {
    console.log('WebSocket接続が確立されました');
    
    // 表示の切り替え
    loginPage.classList.remove('active');
    chatPage.classList.add('active');
    
    // ユーザー名表示
    connectedUsername.textContent = username;
    
    // メッセージ入力欄にフォーカス
    messageInput.focus();
}

/**
 * WebSocketからメッセージを受信したときの処理
 */
function onMessage(event) {
    const message = JSON.parse(event.data);
    console.log('メッセージを受信しました:', message);

    // メッセージタイプに応じた処理
    switch (message.type) {
        case MESSAGE_TYPE.CHAT:
            displayChatMessage(message);
            break;
        case MESSAGE_TYPE.JOIN:
            displaySystemMessage(message, 'join');
            break;
        case MESSAGE_TYPE.LEAVE:
            displaySystemMessage(message, 'leave');
            break;
        case MESSAGE_TYPE.USERS:
            updateOnlineUsers(message.users);
            break;
        case MESSAGE_TYPE.ERROR:
            displayErrorMessage(message);
            break;
        default:
            console.warn('未知のメッセージタイプ:', message.type);
    }
/**
 * チャットアプリケーションのフロントエンド機能
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOMエレメント
    const loginPage = document.getElementById('login-page');
    const chatPage = document.getElementById('chat-page');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('chat-messages');
    const userList = document.getElementById('user-list');
    const chatHeader = document.getElementById('chat-header');
    const logoutButton = document.getElementById('logout-button');
    
    // WebSocket接続
    let socket = null;
    let username = '';
    
    // ログインフォームの送信イベント
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        username = usernameInput.value.trim();
        
        if (username) {
            connectToChat(username);
        }
    });
    
    // メッセージフォームの送信イベント
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });
    
    // ログアウトボタンのクリックイベント
    logoutButton.addEventListener('click', function() {
        disconnectFromChat();
    });
    
    /**
     * WebSocketサーバーに接続
     * @param {string} username - ユーザー名
     */
    function connectToChat(username) {
        // コンテキストルートを取得してWebSocket URLを構築
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const contextPath = 'chatapp-ee'; // コンテキストパスを指定
        
        const wsUrl = `${protocol}//${host}/${contextPath}/chat/${username}`;
        
        // WebSocket接続を開始
        socket = new WebSocket(wsUrl);
        
        // WebSocket接続が開いたときの処理
        socket.onopen = function() {
            console.log('WebSocket接続が確立されました');
            
            // ログインページを非表示にし、チャットページを表示
            loginPage.classList.remove('active');
            chatPage.classList.add('active');
            
            // チャットヘッダーにユーザー名を表示
            chatHeader.textContent = `${username} としてチャット中`;
            
            // メッセージ入力欄にフォーカス
            messageInput.focus();
        };
        
        // WebSocketからメッセージを受信したときの処理
        socket.onmessage = function(event) {
            const message = JSON.parse(event.data);
            handleReceivedMessage(message);
        };
        
        // WebSocket接続が閉じたときの処理
        socket.onclose = function() {
            console.log('WebSocket接続が閉じられました');
            returnToLogin();
        };
        
        // WebSocketエラーが発生したときの処理
        socket.onerror = function(error) {
            console.error('WebSocketエラーが発生しました:', error);
            showErrorMessage('サーバーとの接続中にエラーが発生しました。');
            returnToLogin();
        };
    }
    
    /**
     * WebSocket接続を切断
     */
    function disconnectFromChat() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
        }
    }
    
    /**
     * ログイン画面に戻る
     */
    function returnToLogin() {
        username = '';
        chatPage.classList.remove('active');
        loginPage.classList.add('active');
        messagesContainer.innerHTML = '';
        userList.innerHTML = '';
    }
    
    /**
     * メッセージを送信
     */
    function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (messageText && socket && socket.readyState === WebSocket.OPEN) {
            socket.send(messageText);
            messageInput.value = '';
        }
    }
    
    /**
     * 受信したメッセージを処理
     * @param {Object} message - 受信したメッセージオブジェクト
     */
    function handleReceivedMessage(message) {
        switch (message.type) {
            case 'MESSAGE':
                addMessageToChat(message);
                break;
            case 'JOIN':
                addSystemMessage(message.content);
                break;
            case 'LEAVE':
                addSystemMessage(message.content);
                break;
            case 'USERS':
                updateUserList(message.users);
                break;
            default:
                console.warn('不明なメッセージタイプ:', message.type);
        }
        
        // 最新のメッセージが見えるようにスクロール
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    /**
     * チャットにメッセージを追加
     * @param {Object} message - 追加するメッセージオブジェクト
     */
    function addMessageToChat(message) {
        const isSelf = message.sender === username;
        const messageClass = isSelf ? 'message self' : 'message other';
        
        const date = new Date(message.timestamp);
        const timeString = formatTime(date);
        
        const messageElement = document.createElement('div');
        messageElement.className = messageClass;
        
        messageElement.innerHTML = `
            ${!isSelf ? `<div class="message-sender">${message.sender}</div>` : ''}
            <div class="message-content">
                ${message.content}
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
    }
    
    /**
     * システムメッセージを追加
     * @param {string} text - システムメッセージのテキスト
     */
    function addSystemMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message system';
        
        messageElement.innerHTML = `
            <div class="message-content">
                ${text}
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
    }
    
    /**
     * エラーメッセージを表示
     * @param {string} text - エラーメッセージのテキスト
     */
    function showErrorMessage(text) {
        alert(text);
    }
    
    /**
     * ユーザーリストを更新
     * @param {Array} users - オンラインユーザーの配列
     */
    function updateUserList(users) {
        userList.innerHTML = '';
        
        users.forEach(function(user) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="user-status"></span>
                ${user}
            `;
            userList.appendChild(listItem);
        });
    }
    
    /**
     * 時刻をフォーマット
     * @param {Date} date - 時刻
     * @returns {string} フォーマットされた時刻
     */
    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    // エンターキーでフォーム送信するための処理
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
    // スクロールを最下部に移動
    scrollToBottom();
}

/**
 * WebSocket接続が閉じられたときの処理
 */
function onClose(event) {
    console.log('WebSocket接続が閉じられました: ' + (event.reason || '理由なし'));
    
    // 画面をログイン状態に戻す
    chatPage.classList.remove('active');
    loginPage.classList.add('active');
    
    // エラー理由がある場合は表示
    if (event.reason) {
        alert('接続が閉じられました: ' + event.reason);
    }
    
    // 変数をリセット
    webSocket = null;
    username = '';
    
    // メッセージエリアをクリア
    messageArea.innerHTML = '';
    messageInput.value = '';
    
    // ユーザーリストをクリア
    onlineUsers.innerHTML = '<li class="empty-list">接続中のユーザーはいません</li>';
}

/**
 * WebSocketでエラーが発生したときの処理
 */
function onError(event) {
    console.error('WebSocketエラーが発生しました:', event);
    alert('WebSocket接続エラーが発生しました。ページをリロードしてください。');
}

/**
 * メッセージを送信する
 */
function sendMessage() {
    const messageContent = messageInput.value.trim();
    if (messageContent === '' || webSocket === null) {
        return;
    }

    // メッセージオブジェクトを作成
    const message = {
        type: MESSAGE_TYPE.CHAT,
        content: messageContent
    };

    // WebSocketで送信
    webSocket.send(JSON.stringify(message));

    // 入力欄をクリア
    messageInput.value = '';
    messageInput.focus();
}

/**
 * チャットメッセージを表示する
 */
function displayChatMessage(message) {
    const isCurrentUser = message.sender === username;
    const messageClass = isCurrentUser ? 'user-message' : 'other-message';
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageClass}`;
    
    messageElement.innerHTML = `
        <div class="metadata">
            <span class="sender">${escapeHtml(message.sender)}</span>
            <span class="timestamp">${message.timestamp}</span>
        </div>
        <div class="content">${escapeHtml(message.content)}</div>
    `;
    
    messageArea.appendChild(messageElement);
}

/**
 * システムメッセージを表示する
 */
function displaySystemMessage(message, type = '') {
    const messageElement = document.createElement('div');
    messageElement.className = `message system-message ${type}`;
    
    messageElement.innerHTML = `
        <div class="content">${escapeHtml(message.content)}</div>
    `;
    
    messageArea.appendChild(messageElement);
}

/**
 * エラーメッセージを表示する
 */
function displayErrorMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message system-message error';
    
    messageElement.innerHTML = `
        <div class="content">エラー: ${escapeHtml(message.content)}</div>
    `;
    
    messageArea.appendChild(messageElement);
}

/**
 * オンラインユーザーリストを更新する
 */
function updateOnlineUsers(users) {
    // ユーザーリストをクリア
    onlineUsers.innerHTML = '';
    
    if (!users || users.length === 0) {
        // ユーザーがいない場合
        onlineUsers.innerHTML = '<li class="empty-list">接続中のユーザーはいません</li>';
        return;
    }
    
    // ユーザーリストを作成
    users.forEach(user => {
        const userElement = document.createElement('li');
        userElement.textContent = user;
        
        // 現在のユーザーの場合はクラスを追加
        if (user === username) {
            userElement.classList.add('current-user');
        }
        
        onlineUsers.appendChild(userElement);
    });
}

/**
 * メッセージエリアを最下部にスクロールする
 */
function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

/**
 * HTMLをエスケープする
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
// システムメッセージを追加する関数
function addSystemMessage(content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'system-message');
    
    const contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.textContent = content;
    
    messageElement.appendChild(contentElement);
    messageArea.appendChild(messageElement);
}

// チャットメッセージを追加する関数
function addChatMessage(sender, content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // 自分のメッセージか他のユーザーのメッセージかで表示を変える
    if (sender === username) {
        messageElement.classList.add('user-message');
    } else {
        messageElement.classList.add('other-message');
    }
    
    const senderElement = document.createElement('div');
    senderElement.classList.add('sender');
    senderElement.textContent = sender;
    
    const contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.textContent = content;
    
    messageElement.appendChild(senderElement);
    messageElement.appendChild(contentElement);
    messageArea.appendChild(messageElement);
}

// オンラインユーザーリストを更新する関数
function updateOnlineUsers(users) {
    // リストをクリア
    onlineUsers.innerHTML = '';
    
    // ユーザーごとにリスト項目を追加
    users.forEach(user => {
        const userElement = document.createElement('li');
        userElement.textContent = user;
        // 自分自身の名前に印をつける
        if (user === username) {
            userElement.textContent += ' (あなた)';
            userElement.style.fontWeight = 'bold';
        }
        onlineUsers.appendChild(userElement);
    });
}
    // WebSocket接続を保持するための変数
    let webSocket;
    // 現在のユーザー名を保持
    let currentUsername = '';
/**
 * Jakarta EE WebSocketチャットアプリケーション
 * フロントエンドJavaScript
 */

// DOM要素の取得
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');
const loginForm = document.getElementById('login-form');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const messageArea = document.getElementById('message-area');
const onlineUsers = document.getElementById('online-users');
const usernameInput = document.getElementById('username');
const logoutBtn = document.getElementById('logout-btn');
const connectionStatus = document.getElementById('connection-status');

// 状態管理変数
let username = null;
let webSocket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// ページロード時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからユーザー名を復元（自動ログイン）
    const savedUsername = localStorage.getItem('chatUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }
});

// ログインフォームの送信処理
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    username = usernameInput.value.trim();
    if (username) {
        // ユーザー名をローカルストレージに保存（次回自動入力用）
        localStorage.setItem('chatUsername', username);
        
        // WebSocket接続を開始
        showConnectionStatus(true);
        connectToWebSocket();
    }
});

// メッセージフォームの送信処理
messageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const message = messageInput.value.trim();
    if (message && webSocket) {
        // メッセージを送信
        webSocket.send(message);
        messageInput.value = '';
        messageInput.focus();
    }
});

// ログアウトボタンのクリック処理
logoutBtn.addEventListener('click', function() {
    if (webSocket) {
        webSocket.close();
    }
});
/**
 * Jakarta EE WebSocketチャットアプリケーション
 * フロントエンドJavaScript
 */

// DOM要素の取得
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');
const loginForm = document.getElementById('login-form');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const messageArea = document.getElementById('message-area');
const onlineUsers = document.getElementById('online-users');
const usernameInput = document.getElementById('username');
const logoutBtn = document.getElementById('logout-btn');
const connectionStatus = document.getElementById('connection-status');

// 状態管理変数
let username = null;
let webSocket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// ページロード時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからユーザー名を復元（自動ログイン）
    const savedUsername = localStorage.getItem('chatUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }
});

// ログインフォームの送信処理
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    username = usernameInput.value.trim();
    if (username) {
        // ユーザー名をローカルストレージに保存（次回自動入力用）
        localStorage.setItem('chatUsername', username);
        
        // WebSocket接続を開始
        showConnectionStatus(true);
        connectToWebSocket();
    }
});

// メッセージフォームの送信処理
messageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const message = messageInput.value.trim();
    if (message && webSocket) {
        // メッセージを送信
        webSocket.send(JSON.stringify({
            type: 'CHAT',
            content: message
        }));
        messageInput.value = '';
        messageInput.focus();
    }
});

// ログアウトボタンのクリック処理
logoutBtn.addEventListener('click', function() {
    if (webSocket) {
        webSocket.close();
    }
    showLoginPage();
    username = null;
});

/**
 * WebSocket接続を開始する関数
 */
function connectToWebSocket() {
    // 現在のホスト名を取得してWebSocketのURLを構築
    const host = window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // アプリケーションのコンテキストパスを取得
    let contextPath = window.location.pathname;
    if (contextPath.endsWith('/')) {
        contextPath = contextPath.substring(0, contextPath.length - 1);
    }
    if (contextPath.includes('/')) {
        contextPath = contextPath.substring(0, contextPath.lastIndexOf('/'));
    }
    
    // WebSocketエンドポイントのURL
    const wsUrl = `${wsProtocol}//${host}${contextPath}/chat/${username}`;
    
    try {
        webSocket = new WebSocket(wsUrl);
        
        // WebSocketイベントハンドラの設定
        webSocket.onopen = function() {
            console.log('WebSocket接続が確立されました');
            showChatPage();
            reconnectAttempts = 0;
            hideConnectionStatus();
        };
        
        webSocket.onmessage = function(event) {
            const message = JSON.parse(event.data);
            handleMessage(message);
        };
        
        webSocket.onclose = function(event) {
            console.log('WebSocket接続が閉じられました', event.code, event.reason);
            
            if (event.code !== 1000) { // 正常終了以外の場合
                // 自動再接続を試みる
                if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    showConnectionStatus(false);
                    reconnectAttempts++;
                    setTimeout(connectToWebSocket, 3000); // 3秒後に再接続
                } else {
                    showLoginPage();
                    showErrorMessage('サーバーに接続できません。ネットワーク接続を確認してください。');
                }
            } else {
                showLoginPage();
            }
        };
        
        webSocket.onerror = function(error) {
            console.error('WebSocketエラー:', error);
            showErrorMessage('接続エラーが発生しました。');
        };
        
    } catch (error) {
        console.error('WebSocket接続エラー:', error);
        showErrorMessage('サーバーに接続できません。');
    }
}

/**
 * 受信したメッセージを処理する関数
 */
function handleMessage(message) {
    switch (message.type) {
        case 'CHAT':
            addChatMessage(message.sender, message.content, message.sender === username);
            break;
            
        case 'SYSTEM':
            addSystemMessage(message.content);
            break;
            
        case 'USERS':
            updateUsersList(message.users);
            break;
            
        case 'ERROR':
            showErrorMessage(message.content);
            break;
            
        default:
            console.log('不明なメッセージタイプ:', message);
    }
}

/**
 * チャットメッセージをUIに追加する関数
 */
function addChatMessage(sender, content, isCurrentUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isCurrentUser ? 'message user-message' : 'message other-message';
    
    const senderSpan = document.createElement('div');
    senderSpan.className = 'sender';
    senderSpan.textContent = sender;
    
    const contentSpan = document.createElement('div');
    contentSpan.className = 'content';
    contentSpan.textContent = content;
    
    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(contentSpan);
    
    messageArea.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * システムメッセージをUIに追加する関数
 */
function addSystemMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system-message';
    messageDiv.textContent = content;
    
    messageArea.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * エラーメッセージを表示する関数
 */
function showErrorMessage(content) {
    // 既存のエラーメッセージがあれば削除
    const existingError = document.querySelector('.system-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'system-error';
    errorDiv.textContent = content;
    
    const container = loginPage.classList.contains('active') 
        ? loginPage.querySelector('.login-container') 
        : document.querySelector('.chat-header');
        
    container.appendChild(errorDiv);
    
    // 5秒後にエラーメッセージを消す
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * オンラインユーザーリストを更新する関数
 */
function updateUsersList(users) {
    // リストをクリア
    onlineUsers.innerHTML = '';
    
    if (users.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty-list';
        emptyItem.textContent = 'オンラインユーザーがいません';
        onlineUsers.appendChild(emptyItem);
        return;
    }
    
    // ユーザーをリストに追加
    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.textContent = user;
        
        // 現在のユーザーを強調表示
        if (user === username) {
            userItem.className = 'current-user';
            userItem.textContent += ' (自分)';
        }
        
        onlineUsers.appendChild(userItem);
    });
}

/**
 * メッセージエリアを自動スクロールする関数
 */
function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

/**
 * ログインページを表示する関数
 */
function showLoginPage() {
    chatPage.classList.remove('active');
    loginPage.classList.add('active');
    hideConnectionStatus();
}

/**
 * チャットページを表示する関数
 */
function showChatPage() {
    loginPage.classList.remove('active');
    chatPage.classList.add('active');
    messageInput.focus();
}

/**
 * 接続状態表示の関数
 */
function showConnectionStatus(isConnecting) {
    if (!connectionStatus) return;
    
    connectionStatus.textContent = isConnecting 
        ? '接続中...' 
        : '再接続中... 試行: ' + reconnectAttempts;
    
    connectionStatus.classList.remove('hidden');
}

/**
 * 接続状態表示を隠す関数
 */
function hideConnectionStatus() {
    if (!connectionStatus) return;
    connectionStatus.classList.add('hidden');
}

// ページ離脱時の処理（接続を閉じる）
window.addEventListener('beforeunload', function() {
    if (webSocket) {
        webSocket.close();
    }
});
/**
 * WebSocket接続を開始する関数
 */
function connectToWebSocket() {
    // 現在のホスト名を取得してWebSocketのURLを構築
    const host = window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${host}/chatapp/chat/${encodeURIComponent(username)}`;
    
    console.log('WebSocket接続を試行中: ' + wsUrl);
    
    // WebSocketに接続
    webSocket = new WebSocket(wsUrl);
    
    // 接続が開いたときの処理
    webSocket.onopen = function() {
        console.log('WebSocket接続が確立されました');
        showConnectionStatus(false);
        
        // ログインページを隠してチャットページを表示
        loginPage.classList.remove('active');
        chatPage.classList.add('active');
        
        // メッセージ入力欄にフォーカス
        messageInput.focus();
        
        // 再接続カウンターをリセット
        reconnectAttempts = 0;
    };
    
    // メッセージを受信したときの処理
    webSocket.onmessage = function(event) {
        try {
            const message = JSON.parse(event.data);
            handleReceivedMessage(message);
        } catch (error) {
            console.error('メッセージの解析エラー:', error);
            console.log('受信したデータ:', event.data);
        }
    };
    
    // エラーが発生したときの処理
    webSocket.onerror = function(error) {
        console.error('WebSocketエラー:', error);
        showConnectionStatus(false);
    };
    
    // 接続が閉じたときの処理
    webSocket.onclose = function(event) {
        console.log('WebSocket接続が閉じられました。コード:', event.code);
        
        // チャットページを隠してログインページを表示（意図的なログアウトか接続エラーの場合）
        chatPage.classList.remove('active');
        loginPage.classList.add('active');
        
        // 接続ステータス表示を消す
        showConnectionStatus(false);
        
        // 接続が異常終了した場合は再接続を試みる
        if (event.code !== 1000 && event.code !== 1001) {
            attemptReconnect();
        } else {
            // 通常終了の場合はメッセージエリアをクリア
            messageArea.innerHTML = '';
        }
    };
}

/**
 * 再接続を試行する関数
 */
function attemptReconnect() {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 30000);
        console.log(`${delay}ミリ秒後に再接続を試みます (試行: ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        
        setTimeout(() => {
            if (username) {
                showConnectionStatus(true);
                connectToWebSocket();
            }
        }, delay);
    } else {
        console.log('最大再接続試行回数に達しました');
        
        // 再接続失敗のメッセージを表示
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('system-error');
        errorMessage.textContent = 'サーバーとの接続が切断されました。ページを再読み込みしてください。';
        document.querySelector('.login-container').appendChild(errorMessage);
    }
}

/**
 * 接続ステータスの表示/非表示を切り替える関数
 */
function showConnectionStatus(show) {
    if (show) {
        connectionStatus.classList.remove('hidden');
    } else {
        connectionStatus.classList.add('hidden');
    }
}

/**
 * 受信したメッセージを処理する関数
 */
function handleReceivedMessage(message) {
    switch (message.type) {
        case 'JOIN':
            // ユーザー参加メッセージ
            addSystemMessage(message.content);
            break;
            
        case 'LEAVE':
            // ユーザー退出メッセージ
            addSystemMessage(message.content);
            break;
            
        case 'MESSAGE':
            // 通常のチャットメッセージ
            addChatMessage(message.sender, message.content);
            break;
            
        case 'USERS':
            // オンラインユーザーリスト
            updateOnlineUsers(message.users);
            break;
            
        default:
            console.warn('未知のメッセージタイプ:', message.type);
    }
    
    // 自動スクロールでメッセージエリアの最下部に移動
    messageArea.scrollTop = messageArea.scrollHeight;
}

/**
 * システムメッセージを追加する関数
 */
function addSystemMessage(content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'system-message');
    
    const contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.textContent = content;
    
    messageElement.appendChild(contentElement);
    messageArea.appendChild(messageElement);
}

/**
 * チャットメッセージを追加する関数
 */
function addChatMessage(sender, content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // 自分のメッセージか他のユーザーのメッセージかで表示を変える
    if (sender === username) {
        messageElement.classList.add('user-message');
    } else {
        messageElement.classList.add('other-message');
    }
    
    const senderElement = document.createElement('div');
    senderElement.classList.add('sender');
    senderElement.textContent = sender;
    
    const contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.textContent = content;
    
    messageElement.appendChild(senderElement);
    messageElement.appendChild(contentElement);
    messageArea.appendChild(messageElement);
}

/**
 * オンラインユーザーリストを更新する関数
 */
function updateOnlineUsers(users) {
    // リストをクリア
    onlineUsers.innerHTML = '';
    
    // ユーザーがいない場合
    if (!users || users.length === 0) {
        const emptyElement = document.createElement('li');
        emptyElement.textContent = 'オンラインユーザーはいません';
        emptyElement.classList.add('empty-list');
        onlineUsers.appendChild(emptyElement);
        return;
    }
    
    // ユーザーをアルファベット順にソート
    users.sort((a, b) => {
        // 自分自身は常に先頭に
        if (a === username) return -1;
        if (b === username) return 1;
        return a.localeCompare(b);
    });
    
    // ユーザーごとにリスト項目を追加
    users.forEach(user => {
        const userElement = document.createElement('li');
        userElement.textContent = user;
        
        // 自分自身の名前に印をつける
        if (user === username) {
            userElement.textContent += ' (あなた)';
            userElement.classList.add('current-user');
        }
        
        onlineUsers.appendChild(userElement);
    });
}

// エラーハンドリング
window.addEventListener('error', function(event) {
    console.error('グローバルエラー:', event.error);
});
    // ログインボタンクリック時の処理
    loginButton.addEventListener('click', connect);
    // ユーザー名入力フィールドでEnterキーが押された場合
    usernameInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            connect();
        }
    });

    // メッセージ送信ボタンクリック時の処理
    sendButton.addEventListener('click', sendMessage);
    // メッセージ入力フィールドでEnterキーが押された場合
    messageInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    /**
     * WebSocketサーバーに接続する
     */
    function connect() {
        const username = usernameInput.value.trim();
        
        if (!username) {
            loginStatus.textContent = 'ユーザー名を入力してください';
            return;
        }

        if (username.length > 15) {
            loginStatus.textContent = 'ユーザー名は15文字以内にしてください';
            return;
        }

        loginStatus.textContent = '接続中...';
        
        // WebSocketエンドポイントへの接続
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = window.location.host;
        const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        const websocketUrl = `${protocol}${host}${path}/chat/${username}`;
        
        webSocket = new WebSocket(websocketUrl);
        
        // 接続オープン時のハンドラ
        webSocket.onopen = function() {
            currentUsername = username;
            connectionStatus.textContent = '接続済み';
            loginPage.style.display = 'none';
            chatPage.style.display = 'block';
            connectedUser.textContent = `${username} としてログイン中`;
            
            // 自動でメッセージ入力フィールドにフォーカス
            messageInput.focus();
        };
        
        // メッセージ受信時のハンドラ
        webSocket.onmessage = function(event) {
            const message = JSON.parse(event.data);
            
            switch(message.type) {
                case 'CHAT':
                    displayChatMessage(message);
                    break;
                case 'JOIN':
                    displaySystemMessage(`${message.username}${message.content}`);
                    break;
                case 'LEAVE':
                    displaySystemMessage(`${message.username}${message.content}`);
                    break;
                case 'USERS_LIST':
                    updateUsersList(message.content.split(','));
                    break;
                default:
                    console.error('未知のメッセージタイプ:', message.type);
            }
            
            // メッセージエリアを最下部にスクロール
            messageArea.scrollTop = messageArea.scrollHeight;
        };
        
        // 接続エラー時のハンドラ
        webSocket.onerror = function(error) {
            loginStatus.textContent = 'WebSocket接続エラー';
            connectionStatus.textContent = '接続エラー';
            console.error('WebSocket Error:', error);
        };
        
        // 接続クローズ時のハンドラ
        webSocket.onclose = function() {
            connectionStatus.textContent = '接続が切断されました';
            
            // 5秒後に再接続ページに戻る
            setTimeout(function() {
                loginPage.style.display = 'block';
                chatPage.style.display = 'none';
                loginStatus.textContent = '再接続するにはユーザー名を入力してください';
            }, 5000);
        };
    }

    /**
     * メッセージを送信する
     */
    function sendMessage() {
        const content = messageInput.value.trim();
        
        if (!content) {
            return;
        }
        
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            // メッセージオブジェクトを作成
            const message = {
                content: content,
                type: 'CHAT'
            };
            
            // JSONに変換して送信
            webSocket.send(JSON.stringify(message));
            
            // 入力フィールドをクリア
            messageInput.value = '';
        } else {
            connectionStatus.textContent = '接続されていません';
        }
    }

    /**
     * チャットメッセージを表示する
     */
    function displayChatMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + (message.username === currentUsername ? 'own' : 'other');
        
        const messageHeader = document.createElement('div');
        messageHeader.className = 'message-header';
        
        const usernameSpan = document.createElement('span');
        usernameSpan.textContent = message.username;
        
        const timestampSpan = document.createElement('span');
        timestampSpan.textContent = message.timestamp;
        
        messageHeader.appendChild(usernameSpan);
        messageHeader.appendChild(timestampSpan);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message.content;
        
        messageDiv.appendChild(messageHeader);
        messageDiv.appendChild(messageContent);
        
        messageArea.appendChild(messageDiv);
    }

    /**
     * システムメッセージを表示する
     */
    function displaySystemMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system';
        messageDiv.textContent = content;
        messageArea.appendChild(messageDiv);
    }

    /**
     * ユーザーリストを更新する
     */
    function updateUsersList(users) {
        usersList.innerHTML = '';
        
        users.forEach(function(username) {
            if (username) {
                const userDiv = document.createElement('div');
                userDiv.className = 'user-item';
                userDiv.textContent = username + (username === currentUsername ? ' (あなた)' : '');
                usersList.appendChild(userDiv);
            }
        });
    }

    // ページを離れる際の処理
    window.addEventListener('beforeunload', function() {
        // WebSocket接続を閉じる
        if (webSocket) {
            webSocket.close();
        }
    });
});

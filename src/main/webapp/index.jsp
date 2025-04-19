<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Jakarta EEチャットアプリ</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f8fa;
            color: #333;
        }
        #loginPage, #chatPage {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
        }
        #chatPage {
            display: none;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eaeaea;
            padding-bottom: 15px;
            margin-bottom: 15px;
        }
        h1 {
            color: #1da1f2;
            margin: 0;
        }
        .chat-container {
            display: flex;
            height: 70vh;
        }
        .users-container {
            width: 25%;
            border-right: 1px solid #eaeaea;
            padding-right: 15px;
            overflow-y: auto;
        }
        .chat-area {
            width: 75%;
            display: flex;
            flex-direction: column;
        }
        #messageArea {
            flex-grow: 1;
            overflow-y: auto;
            padding: 15px;
            background-color: #f7f9fa;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        .message {
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 5px;
            max-width: 80%;
        }
        .message.own {
            background-color: #dcf8c6;
            margin-left: auto;
        }
        .message.other {
            background-color: white;
            border: 1px solid #eaeaea;
        }
        .message.system {
            background-color: #f2f2f2;
            color: #666;
            width: 100%;
            text-align: center;
            font-style: italic;
        }
        .message-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 0.8em;
            color: #666;
        }
        .message-content {
            word-break: break-word;
        }
        .input-group {
            display: flex;
            margin-top: 10px;
        }
        input[type="text"] {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1em;
        }
        button {
            background-color: #1da1f2;
            color: white;
            border: none;
            padding: 10px 15px;
            margin-left: 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
        }
        button:hover {
            background-color: #1991db;
        }
        .user-item {
            padding: 8px;
            margin-bottom: 5px;
            background-color: #f2f2f2;
            border-radius: 4px;
        }
        .status {
            font-size: 0.8em;
            color: #666;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <!-- ログイン画面 -->
    <div id="loginPage">
        <div class="header">
            <h1>Jakarta EEチャット</h1>
        </div>
        <p>ユーザー名を入力してチャットに参加しましょう</p>
        <div class="input-group">
            <input type="text" id="username" placeholder="ユーザー名を入力" autofocus />
            <button id="loginButton">参加する</button>
        </div>
        <div class="status" id="loginStatus"></div>
    </div>

    <!-- チャット画面 -->
    <div id="chatPage">
        <div class="header">
            <h1>Jakarta EEチャット</h1>
            <div id="connectedUser"></div>
        </div>
        <div class="chat-container">
            <div class="users-container">
                <h3>参加者</h3>
                <div id="usersList"></div>
            </div>
            <div class="chat-area">
                <div id="messageArea"></div>
                <div class="input-group">
                    <input type="text" id="messageInput" placeholder="メッセージを入力" />
                    <button id="sendButton">送信</button>
                </div>
            </div>
        </div>
        <div class="status" id="connectionStatus">未接続</div>
    </div>

    <script src="${pageContext.request.contextPath}/js/chat.js"></script>
</body>
</html>
<%@ page contentType="text/html;charset=UTF-8" language="java" isErrorPage="true" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>エラー - Jakarta EEチャット</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f5f8fa;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .error-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
            max-width: 500px;
        }
        h1 {
            color: #e74c3c;
            margin-top: 0;
        }
        .error-code {
            font-size: 72px;
            font-weight: bold;
            color: #e74c3c;
            margin: 20px 0;
        }
        .error-message {
            color: #555;
            margin-bottom: 30px;
        }
        .home-button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: bold;
        }
        .home-button:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>エラーが発生しました</h1>
        <div class="error-code">
            <%= response.getStatus() %>
        </div>
        <div class="error-message">
            <% if (exception != null) { %>
                <%= exception.getMessage() %>
            <% } else { %>
                ページの表示中に問題が発生しました。
            <% } %>
        </div>
        <a href="${pageContext.request.contextPath}/" class="home-button">ホームに戻る</a>
    </div>
</body>
</html>

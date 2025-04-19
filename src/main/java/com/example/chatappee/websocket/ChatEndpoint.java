package com.example.chatappee.websocket;

import com.example.chatappee.model.ChatMessage;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocketエンドポイント - チャットアプリケーションの中心的な実装
 */
@ServerEndpoint("/chat/{username}")
public class ChatEndpoint {

    // すべてのWebSocketセッションを保持
    private static final Map<String, Session> sessions = new ConcurrentHashMap<>();
    
    // JSONの変換用
    private final Jsonb jsonb = JsonbBuilder.create();

    /**
     * クライアントが接続したときに呼び出される
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("username") String username) {
        // ユーザー名が既に使用されていないか確認
        if (sessions.values().stream()
                .anyMatch(s -> username.equals(s.getUserProperties().get("username")))) {
            try {
                ChatMessage errorMessage = new ChatMessage(
                        "システム", 
                        "ユーザー名「" + username + "」は既に使用されています。別の名前でお試しください。", 
                        ChatMessage.MessageType.CHAT
                );
                session.getBasicRemote().sendText(jsonb.toJson(errorMessage));
                session.close();
                return;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        // ユーザー名をセッションプロパティに保存
        session.getUserProperties().put("username", username);
        sessions.put(session.getId(), session);

        // 新しいユーザーが参加したことを通知
        ChatMessage joinMessage = new ChatMessage(
                username, 
                "さんが入室しました", 
                ChatMessage.MessageType.JOIN
        );
        broadcast(joinMessage);
        
        // 現在のユーザーリストを送信
        sendUsersList();
    }

    /**
     * クライアントからメッセージを受信したときに呼び出される
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        String username = (String) session.getUserProperties().get("username");
        
        // 受信したJSONメッセージをChatMessageオブジェクトに変換
        try {
            ChatMessage chatMessage = jsonb.fromJson(message, ChatMessage.class);
            chatMessage.setUsername(username);
            
            // すべてのクライアントにメッセージをブロードキャスト
            broadcast(chatMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * クライアントが切断したときに呼び出される
     */
    @OnClose
    public void onClose(Session session) {
        String username = (String) session.getUserProperties().get("username");
        sessions.remove(session.getId());
        
        if (username != null) {
            // ユーザーが退出したことを通知
            ChatMessage leaveMessage = new ChatMessage(
                    username, 
                    "さんが退室しました", 
                    ChatMessage.MessageType.LEAVE
            );
            broadcast(leaveMessage);
            
            // ユーザーリストを更新
            sendUsersList();
        }
    }

    /**
     * エラーが発生した場合に呼び出される
     */
    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("WebSocketエラー: " + throwable.getMessage());
        throwable.printStackTrace();
    }

    /**
     * すべての接続クライアントにメッセージをブロードキャスト
     */
    private void broadcast(ChatMessage message) {
        String json = jsonb.toJson(message);
        
        for (Session session : sessions.values()) {
            try {
                if (session.isOpen()) {
                    session.getAsyncRemote().sendText(json);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 現在接続中のユーザーリストを全クライアントに送信
     */
    private void sendUsersList() {
        Set<String> usernames = ConcurrentHashMap.newKeySet();
        
        for (Session session : sessions.values()) {
            String username = (String) session.getUserProperties().get("username");
            if (username != null) {
                usernames.add(username);
            }
        }
        
        // ユーザーリストメッセージを作成
        ChatMessage usersListMessage = new ChatMessage();
        usersListMessage.setType(ChatMessage.MessageType.USERS_LIST);
        usersListMessage.setContent(String.join(",", usernames));
        
        // すべてのクライアントにユーザーリストを送信
        broadcast(usersListMessage);
    }
}

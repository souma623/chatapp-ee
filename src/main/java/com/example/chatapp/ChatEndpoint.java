package com.example.chatapp;

import com.example.chatapp.model.ChatMessage;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * WebSocketエンドポイント - チャットアプリケーションの中心的な実装
 */
@ServerEndpoint("/chat/{username}")
public class ChatEndpoint {

    private static final Logger LOGGER = Logger.getLogger(ChatEndpoint.class.getName());
    
    // すべてのWebSocketセッションを保持
    private static final Map<String, Session> sessions = new ConcurrentHashMap<>();
    
    // JSONの変換用
    private static final Jsonb jsonb;
    
    // 静的初期化ブロック
    static {
        try {
            jsonb = JsonbBuilder.create();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "JSONBの初期化に失敗しました", e);
            throw new RuntimeException("JSONBの初期化エラー", e);
        }
    }

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
                        ChatMessage.MessageType.ERROR, 
                        "ユーザー名「" + username + "」は既に使用されています。別の名前でお試しください。", 
                        "システム"
                );
                session.getBasicRemote().sendText(jsonb.toJson(errorMessage));
                session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "ユーザー名が重複しています"));
                return;
            } catch (IOException e) {
                LOGGER.log(Level.SEVERE, "セッションを閉じる際にエラーが発生しました", e);
            }
        }

        // ユーザー名をセッションプロパティに保存
        session.getUserProperties().put("username", username);
        sessions.put(session.getId(), session);
        
        LOGGER.info(username + "がチャットに参加しました。現在のユーザー数: " + sessions.size());

        // 新しいユーザーが参加したことを通知
        ChatMessage joinMessage = new ChatMessage(
                ChatMessage.MessageType.JOIN, 
                username + "さんが入室しました", 
                "システム"
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
        
        LOGGER.info("メッセージを受信: " + username + " から: " + message);
        
        // 受信したJSONメッセージをChatMessageオブジェクトに変換
        try {
            ChatMessage chatMessage = jsonb.fromJson(message, ChatMessage.class);
            
            if (chatMessage.getType() == ChatMessage.MessageType.CHAT) {
                chatMessage.setSender(username);
                // すべてのクライアントにメッセージをブロードキャスト
                broadcast(chatMessage);
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "メッセージの処理中にエラーが発生しました", e);
            
            // エラーメッセージを送信者に返す
            try {
                ChatMessage errorMessage = new ChatMessage(
                        ChatMessage.MessageType.ERROR,
                        "メッセージ形式が無効です",
                        "システム"
                );
                session.getBasicRemote().sendText(jsonb.toJson(errorMessage));
            } catch (IOException ioe) {
                LOGGER.log(Level.SEVERE, "エラーメッセージの送信に失敗しました", ioe);
            }
        }
    }

    /**
     * クライアントが切断したときに呼び出される
     */
    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        String username = (String) session.getUserProperties().get("username");
        sessions.remove(session.getId());
        
        LOGGER.info(username + "がチャットを退出しました。理由: " + closeReason.getReasonPhrase() + 
                "。現在のユーザー数: " + sessions.size());
        
        if (username != null) {
            // ユーザーが退出したことを通知
            ChatMessage leaveMessage = new ChatMessage(
                    ChatMessage.MessageType.LEAVE, 
                    username + "さんが退室しました", 
                    "システム"
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
        String username = (String) session.getUserProperties().get("username");
        LOGGER.log(Level.SEVERE, username + "のセッションでエラーが発生しました", throwable);
        
        try {
            // エラーが回復不能な場合はセッションを閉じる
            if (session.isOpen()) {
                session.close(new CloseReason(CloseReason.CloseCodes.UNEXPECTED_CONDITION, "サーバーエラーが発生しました"));
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "セッションを閉じる際にエラーが発生しました", e);
        }
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
                LOGGER.log(Level.WARNING, "メッセージの送信中にエラーが発生しました", e);
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
        String[] usersArray = usernames.toArray(new String[0]);
        ChatMessage usersListMessage = new ChatMessage(ChatMessage.MessageType.USERS, usersArray);
        
        // すべてのクライアントにユーザーリストを送信
        broadcast(usersListMessage);
    }
}

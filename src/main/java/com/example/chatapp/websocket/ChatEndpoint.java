package com.example.chatapp.websocket;

import com.example.chatapp.model.ChatMessage;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * WebSocketチャットエンドポイント
 * URL: /chat/{username}
 */
@ServerEndpoint("/chat/{username}")
public class ChatEndpoint {
    
    private static final Logger LOGGER = Logger.getLogger(ChatEndpoint.class.getName());
    
    // すべてのセッションを保持するマップ（ユーザー名 -> セッション）
    private static final Map<String, Session> SESSIONS = new ConcurrentHashMap<>();
    
    // JSON変換のためのJSONBインスタンス
    private static final Jsonb JSONB;
    
    static {
        // JSONB設定を初期化
        JsonbConfig config = new JsonbConfig()
                .withFormatting(true);
        JSONB = JsonbBuilder.create(config);
    }
    
    /**
     * クライアントが接続を開いたときに呼び出されるメソッド
     * 
     * @param session WebSocketセッション
     * @param username パスパラメータのユーザー名
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("username") String username) {
        LOGGER.log(Level.INFO, "新しい接続：{0}", username);
        
        // セッションをマップに保存
        SESSIONS.put(username, session);
        
        // 新しいユーザーが参加したことを全員に通知
        ChatMessage joinMessage = new ChatMessage(
                ChatMessage.MessageType.JOIN,
                username + "さんがチャットに参加しました。",
                "システム"
        );
        broadcast(joinMessage);
        
        // 現在のオンラインユーザーリストを送信
        sendUserList();
    }
    
    /**
     * クライアントからメッセージを受信したときに呼び出されるメソッド
     * 
     * @param message 受信したメッセージ
     * @param username 送信者のユーザー名
     */
    @OnMessage
    public void onMessage(String message, @PathParam("username") String username) {
        LOGGER.log(Level.INFO, "メッセージ受信：{0} から \"{1}\"", new Object[]{username, message});
        
        // 受信したメッセージを全員に送信
        ChatMessage chatMessage = new ChatMessage(
                ChatMessage.MessageType.MESSAGE,
                message,
                username
        );
        broadcast(chatMessage);
    }
    
    /**
     * クライアントが接続を閉じたときに呼び出されるメソッド
     * 
     * @param username 接続を閉じたユーザー名
     */
    @OnClose
    public void onClose(@PathParam("username") String username) {
        LOGGER.log(Level.INFO, "接続終了：{0}", username);
        
        // セッションをマップから削除
        SESSIONS.remove(username);
        
        // ユーザーが退出したことを全員に通知
        ChatMessage leaveMessage = new ChatMessage(
                ChatMessage.MessageType.LEAVE,
                username + "さんがチャットから退出しました。",
                "システム"
        );
        broadcast(leaveMessage);
        
        // 更新されたユーザーリストを送信
        sendUserList();
    }
    
    /**
     * エラーが発生したときに呼び出されるメソッド
     * 
     * @param session エラーが発生したセッション
     * @param throwable 発生した例外
     */
    @OnError
    public void onError(Session session, Throwable throwable) {
        LOGGER.log(Level.SEVERE, "WebSocketエラーが発生しました: ", throwable);
    }
    
    /**
     * 全ての接続中のクライアントにメッセージをブロードキャスト
     * 
     * @param message 送信するメッセージオブジェクト
     */
    private void broadcast(ChatMessage message) {
        try {
            // メッセージをJSON文字列に変換
            String jsonMessage = JSONB.toJson(message);
            
            // 全てのセッションにメッセージを送信
            SESSIONS.values().forEach(session -> {
                try {
                    if (session.isOpen()) {
                        session.getBasicRemote().sendText(jsonMessage);
                    }
                } catch (IOException e) {
                    LOGGER.log(Level.SEVERE, "メッセージ送信中にエラーが発生しました: ", e);
                }
            });
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "JSON変換中にエラーが発生しました: ", e);
        }
    }
    
    /**
     * 現在のオンラインユーザーリストを全てのセッションに送信
     */
    private void sendUserList() {
        // ユーザー名の配列を作成
        String[] users = SESSIONS.keySet().toArray(new String[0]);
        
        // ユーザーリストメッセージを作成して送信
        ChatMessage userListMessage = new ChatMessage(ChatMessage.MessageType.USERS, users);
        broadcast(userListMessage);
    }
}

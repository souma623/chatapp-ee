package com.example.chatappee.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * チャットメッセージを表すモデルクラス
 */
public class ChatMessage {
    private String username;
    private String content;
    private String timestamp;
    private MessageType type;

    public enum MessageType {
        CHAT,       // 通常のチャットメッセージ
        JOIN,       // ユーザー参加メッセージ
        LEAVE,      // ユーザー退出メッセージ
        USERS_LIST  // ユーザーリスト更新
    }

    public ChatMessage() {
        this.timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    public ChatMessage(String username, String content, MessageType type) {
        this();
        this.username = username;
        this.content = content;
        this.type = type;
    }

    // Getter および Setter
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }
}

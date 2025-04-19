package com.example.chatapp.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

/**
 * チャットメッセージを表すモデルクラス
 */
public class ChatMessage implements Serializable {

    private static final long serialVersionUID = 1L;
    private static final String TIMESTAMP_PATTERN = "HH:mm:ss";

    /**
     * メッセージタイプを表す列挙型
     */
    public enum MessageType {
        MESSAGE, // 通常のメッセージ
        JOIN,    // ユーザーがチャットに参加
        LEAVE,   // ユーザーがチャットから退出
        USERS,   // オンラインユーザーリスト
        CHAT, ERROR    // エラーメッセージ
    }

    private MessageType type;
    private String messageText;
    private String sender;
    private String[] onlineUsers;
    private String timestamp;

    /**
     * 引数なしのコンストラクタ（JSON変換用）
     */
    public ChatMessage() {
        this.timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern(TIMESTAMP_PATTERN));
    }

    /**
     * 通常のメッセージ用コンストラクタ
     *
     * @param type        メッセージタイプ
     * @param messageText メッセージ内容
     * @param sender      送信者
     */
    public ChatMessage(MessageType type, String messageText, String sender) {
        this();
        this.type = type;
        this.messageText = messageText;
        this.sender = sender;
    }

    /**
     * ユーザーリスト用コンストラクタ
     *
     * @param type       メッセージタイプ (USERS)
     * @param onlineUsers オンラインユーザーの配列
     */
    public ChatMessage(MessageType type, String[] onlineUsers) {
        this();
        this.type = type;
        this.onlineUsers = onlineUsers;
        this.sender = "システム";
    }

    // Getters and Setters

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String[] getOnlineUsers() {
        return onlineUsers;
    }

    public void setOnlineUsers(String[] onlineUsers) {
        this.onlineUsers = onlineUsers;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
               "type=" + type +
               ", messageText='" + messageText + '\'' +
               ", sender='" + sender + '\'' +
               ", onlineUsers=" +
               (onlineUsers != null ? Arrays.toString(onlineUsers) : "null") +
               ", timestamp='" + timestamp + '\'' +
               '}';
    }
}
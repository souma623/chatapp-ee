package com.example.chatapp;

import java.util.Set;

/**
 * WebSocketで送受信されるメッセージのモデルクラス
 */
public class Message {
    
    /**
     * メッセージタイプ
     * - CHAT: チャットメッセージ
     * - SYSTEM: システムメッセージ
     * - USERS: ユーザーリスト更新
     * - ERROR: エラーメッセージ
     */
    private String type;
    
    /**
     * メッセージ送信者（チャットメッセージの場合）
     */
    private String sender;
    
    /**
     * メッセージ内容
     */
    private String content;
    
    /**
     * オンラインユーザーのリスト（USERSタイプの場合）
     */
    private Set<String> users;
    
    // コンストラクタ
    public Message() {
    }
    
    // ゲッターとセッター
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getSender() {
        return sender;
    }
    
    public void setSender(String sender) {
        this.sender = sender;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Set<String> getUsers() {
        return users;
    }
    
    public void setUsers(Set<String> users) {
        this.users = users;
    }
}

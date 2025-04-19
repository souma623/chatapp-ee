package com.example.chatappee.config;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

/**
 * アプリケーション設定クラス
 * JAX-RSエンドポイントの基本パスを設定
 */
@ApplicationPath("/api")
public class ApplicationConfig extends Application {
    // デフォルト実装のままで十分
}

# Jakarta EE WebSocketチャットアプリケーション
# Jakarta EE WebSocketチャットアプリケーション

## 概要

このプロジェクトはJakarta EE 10とWebSocketを使用した、シンプルでリアルタイムなチャットアプリケーションです。
ユーザーはユーザー名を入力してチャットルームに参加し、他のオンラインユーザーとメッセージをやり取りできます。

## 主な機能

- リアルタイムメッセージング（WebSocket使用）
- ユーザーのオンライン/オフライン状態の表示
- チャットルームへの参加/退出の通知
- レスポンシブデザイン（モバイル対応）
- 自動再接続機能

## 技術スタック

- Jakarta EE 10
- WebSocket API (Jakarta WebSocket 2.1)
- JSON-B (Jakarta JSON Binding 3.0)
- HTML5 / CSS3
- JavaScript (ES6+)
- Maven

## 必要条件

- JDK 21以上
- Maven 3.8以上
- Jakarta EE 10対応のアプリケーションサーバー（WildFlyなど）

## ビルド方法
# Jakarta EE WebSocketチャットアプリケーション

## 概要

このプロジェクトはJakarta EE 10とWebSocketを使用した、シンプルでリアルタイムなチャットアプリケーションです。
ユーザーはユーザー名を入力してチャットルームに参加し、他のオンラインユーザーとメッセージをやり取りできます。

## 主な機能

- WebSocketを利用したリアルタイムチャット
- ユーザー名による認証
- オンラインユーザーリストのリアルタイム更新
- システムメッセージ（参加・退出通知）
- レスポンシブなUIデザイン

## 技術スタック

- **バックエンド**: Jakarta EE 10, WebSocket
- **フロントエンド**: HTML5, CSS3, JavaScript (バニラJS)
- **アプリケーションサーバー**: WildFly 30.0.0.Final
- **ビルドツール**: Maven
- **コンテナ化**: Docker

## 実行方法

以下の3つの方法からお選びください：

### 1. Dockerを使用する方法（最も簡単）

#### 前提条件
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)がインストールされていること

#### 手順

1. **プロジェクトのクローン**
   ```bash
   git clone https://github.com/yourusername/chatapp-ee.git
   cd chatapp-ee
   ```

2. **Dockerイメージのビルドと実行**
   ```bash
   docker build -t chatapp-ee .
   docker run -p 8080:8080 -p 9990:9990 chatapp-ee
   ```

3. **アプリケーションへのアクセス**
   ブラウザで以下のURLにアクセスします：
   ```
   http://localhost:8080/chatapp-ee/
   ```

### 2. WildFlyで実行する方法

#### 前提条件
- JDK 21
- [WildFly 30.0.0.Final](https://www.wildfly.org/downloads/)
- Maven

#### 手順

1. **プロジェクトのビルド**
   ```bash
   mvn clean package
   ```

2. **WildFlyの起動**
   WildFlyのインストールディレクトリで以下を実行：
   ```bash
   # Linux/macOS
   ./bin/standalone.sh
   
   # Windows
   bin\standalone.bat
   ```

3. **アプリケーションのデプロイ**
   以下のいずれかの方法でデプロイできます：
   
   a. 手動でコピー：
   ```bash
   cp target/chatapp-ee.war <WildFly_HOME>/standalone/deployments/
   ```
   
   b. Maven WildFlyプラグインを使用：
   ```bash
   mvn wildfly:deploy
   ```

4. **アプリケーションへのアクセス**
   ブラウザで以下のURLにアクセスします：
   ```
   http://localhost:8080/chatapp-ee/
   ```

### 3. IDEから直接実行（開発時）
# Jakarta EE WebSocketチャットアプリケーション

このプロジェクトは、Jakarta EE 10のWebSocketを使用した簡単なチャットアプリケーションです。ユーザーは名前を入力してチャットに参加し、リアルタイムでメッセージを送受信することができます。

## 機能

- ユーザー名による参加認証
- リアルタイムメッセージ送受信
- システム通知（ユーザーの入退室）
- オンラインユーザー一覧の表示

## 技術スタック

- Jakarta EE 10
- WebSocket API
- JSON-B (JSON Binding API)
- HTML5 / CSS3 / JavaScript

## 使い方

### 前提条件

- Java 21
- Maven 3.8+
- Jakarta EE 10互換のアプリケーションサーバー (WildFly, GlassFish, TomEE, Payara等)

### ビルド方法

```bash
mvn clean package
#### IntelliJ IDEAの場合

1. **プロジェクトを開く**
   「File」→「Open」からプロジェクトを選択

2. **WildFly/JBoss Pluginのインストール**
   「File」→「Settings」→「Plugins」から「WildFly」または「JBoss」で検索してインストール

3. **アプリケーションサーバーの設定**
   「Run」→「Edit Configurations」→「+」→「JBoss/WildFly Local」
   - WildFlyのインストールディレクトリを設定
   - デプロイメントタブで、作成したwarファイルを追加

4. **実行**
   「Run」ボタンをクリック

#### Eclipseの場合

1. **プロジェクトのインポート**
   「File」→「Import」→「Maven」→「Existing Maven Projects」

2. **JBoss Toolsのインストール**
   「Help」→「Eclipse Marketplace」から「JBoss Tools」を検索してインストール

3. **サーバービューでWildFlyを追加**
   「Window」→「Show View」→「Server」→サーバービューを開き、新しいサーバーを追加
   - WildFly 30を選択し、インストールパスを設定

4. **プロジェクトをサーバーに追加**
   プロジェクトを右クリック→「Run As」→「Run on Server」

## ポート開放について

アプリケーションは以下のポートを使用します：

- **8080**: Webアプリケーション用HTTP
- **9990**: WildFly管理コンソール用（オプション）

### Windowsファイアウォールでポートを開放する方法

1. Windowsスタートメニューから「Windowsファイアウォール」を検索して開く
2. 左側の「詳細設定」をクリック
3. 左側の「受信の規則」を右クリック→「新しい規則」
4. 「ポート」を選択→「次へ」
5. 「TCP」を選択し、「特定のローカルポート」に「8080,9990」と入力→「次へ」
6. 「接続を許可する」を選択→「次へ」
7. 適用するネットワークの種類を選択（通常はすべて）→「次へ」
8. 名前を「WildFly Ports」などに設定→「完了」

## トラブルシューティング

### よくある問題

1. **ポートが既に使用されている**
   ```bash
   # 使用中のポートを確認
   netstat -ano | findstr 8080
   
   # プロセスを終了（PIDを指定）
   taskkill /F /PID <PID>
   ```

2. **WildFlyが起動しない**
   - ログファイル（`<WildFly_HOME>/standalone/log/server.log`）を確認
   - Javaバージョンが21であることを確認：`java -version`

3. **WebSocket接続エラー**
   - ブラウザの開発者ツールでコンソールを確認
   - ファイアウォール設定を確認
   - 正しいURLにアクセスしているか確認（`http://localhost:8080/chatapp-ee/`）

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細はLICENSEファイルを参照してください。

## 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成：`git checkout -b my-new-feature`
3. 変更をコミット：`git commit -am 'Add some feature'`
4. ブランチにプッシュ：`git push origin my-new-feature`
5. プルリクエストを送信

## 連絡先

質問や問題がある場合は、issueを作成してください。
```bash
mvn clean package
このプロジェクトは、Jakarta EE 10を使用したシンプルなWebSocketベースのチャットアプリケーションです。
WildFlyアプリケーションサーバーで動作します。

## 機能

- リアルタイムチャット機能
- ユーザー参加/退出の通知
- オンラインユーザーリストの表示
- シンプルかつレスポンシブなUI

## 技術スタック

- Jakarta EE 10
- WebSocket API
- JSON-B (JSON Binding)
- JavaScript (フロントエンド)
- WildFly 30.0.0.Final (動作確認済み)
- Maven 3.8+

## ビルド方法

```bash
mvn clean package

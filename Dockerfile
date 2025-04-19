FROM quay.io/wildfly/wildfly:30.0.0.Final
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM quay.io/wildfly/wildfly:30.0.0.Final-jdk21
COPY --from=build /app/target/chatapp-ee.war /opt/jboss/wildfly/standalone/deployments/

# システムプロパティを設定
ENV JAVA_OPTS="-Djava.net.preferIPv4Stack=true -Djboss.bind.address=0.0.0.0 -Djboss.bind.address.management=0.0.0.0"

# ポート公開
EXPOSE 8080 9990

# ヘルスチェック
HEALTHCHECK --interval=5s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8080/chatapp-ee/ || exit 1

# 起動コマンド
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]
# アプリケーションのWARファイルをコピー
COPY target/chatapp-ee.war /opt/jboss/wildfly/standalone/deployments/

# 管理コンソールを有効化し、外部からのアクセスを許可
RUN /opt/jboss/wildfly/bin/add-user.sh admin Admin#70365 --silent

# 管理コンソールとHTTPポートを公開
EXPOSE 8080 9990

# WildFlyを起動し、コンテナが終了しないようにする
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]

FROM node:20-alpine

WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY . .

# ポートを公開
EXPOSE 5173

# Vite開発サーバーを起動（ホットリロード有効）
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

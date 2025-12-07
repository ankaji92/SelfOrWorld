import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Dockerコンテナ内で外部からアクセス可能にする
    port: 5173,
    watch: {
      usePolling: true, // Dockerボリュームでのホットリロードを有効化
    },
  },
})

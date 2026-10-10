import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 站点部署在用户/组织页根路径
  base: '/',
  // 让 Vite 暴露并注入 REACT_APP_* 前缀的环境变量，与 CRA / GitHub secrets 同名（未知项②）
  envPrefix: 'REACT_APP_',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
});

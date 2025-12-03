// vite.config.ts
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const EXPRESS_API_PORT = process.env.PORT || 3000;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    return {
      server: {
        port: 5173, 
        host: '0.0.0.0',
        
        proxy: {
          '/api': {
            target: `http://localhost:${EXPRESS_API_PORT}`, // Forward to your Express server
            changeOrigin: true,
            secure: false, 
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'), 
        }
      }
    };
});

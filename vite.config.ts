import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 This allows access from other devices on the same network
    port: 5173, // Optional: Specify a port if you want a fixed one
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

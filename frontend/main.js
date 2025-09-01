import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert';
import axios from 'axios';

axios.defaults.withCredentials = true;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
  https: true,
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
      secure: false,
    },
    "/uploads": {
      target: "http://localhost:5000",
      changeOrigin: true,
      secure: false,
    },
  },
},
    optimizeDeps: {
    include: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
    ],
  },
});
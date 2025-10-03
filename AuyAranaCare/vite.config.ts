import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

   server: {
    // Proxy API requests to your backend server
    proxy: {
      '/api': { // Any request starting with /api
        target: 'http://localhost:5000', // This MUST be your backend server's address and port
        changeOrigin: true, // Important for the backend to receive correct host headers
        // secure: false, // Uncomment if your backend is not HTTPS (common in development)
      }
    }
  }
})
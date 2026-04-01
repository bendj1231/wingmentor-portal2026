import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host-app',
      remotes: {
        remote_segment: process.env.NODE_ENV === 'development'
          ? 'http://localhost:5001/assets/remoteEntry.js'
          : 'https://wingmentor-remote.vercel.app/assets/remoteEntry.js', // Placeholder or production URL
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})

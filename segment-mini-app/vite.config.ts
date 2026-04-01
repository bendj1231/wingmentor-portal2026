import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'remote_segment',
            filename: 'remoteEntry.js',
            exposes: {
                './Segment': './src/SegmentUI.tsx',
            },
            shared: ['react', 'react-dom'],
        }),
    ],
    server: {
        port: 5001,
        host: true,
        cors: true,
    },
    build: {
        modulePreload: false,
        target: 'esnext',
        minify: false,
        cssCodeSplit: false,
    },
})

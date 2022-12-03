import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const defineVars = ['API_URL'];

export default defineConfig({
    build: {
        outDir: './dist',
        emptyOutDir: true,
    },
    plugins: [react()],
    define: Object.fromEntries(defineVars.map((key) => [key, JSON.stringify(process.env[key])])),
});

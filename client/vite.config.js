import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: 'automatic', // This enables the new JSX transform
  },
    base: '/quizwiz/', // Add this line
})
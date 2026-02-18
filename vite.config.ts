import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // or '@vitejs/plugin-react' if that's what you have
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- This is the "Plugin" we were talking about!
  ],
})
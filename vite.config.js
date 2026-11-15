import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Runs the site assistant's /api/chat function inside the dev server, so the chat works
// locally exactly as it will on Vercel (where api/chat.js is deployed as a serverless function)
const assistantApi = () => ({
  name: 'assistant-api',
  configureServer(server) {
    // editing the answers (assistant/) or the function (api/) takes effect on the next question
    server.watcher.on('change', (file) => {
      if (/[\\/](assistant|api)[\\/]/.test(file)) server.moduleGraph.invalidateAll()
    })
    server.middlewares.use('/api/chat', async (req, res) => {
      const { default: handler } = await server.ssrLoadModule('/api/chat.js')
      handler(req, res)
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), assistantApi()],
  server: {
    port: 5180,
    open: true,
  },
  preview: {
    port: 5181,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

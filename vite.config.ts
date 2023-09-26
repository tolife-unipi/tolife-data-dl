import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
	outDir: 'build',
  },
  define: {
	'process.env.APP_VERSION': JSON.stringify(process.env.npm_package_version)
  },
  server: {
	open: true
  }
})

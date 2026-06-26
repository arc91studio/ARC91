import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        blogs: resolve(__dirname, 'blogs.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        career: resolve(__dirname, 'career.html'),
        contact: resolve(__dirname, 'contact.html'),
        waitlist: resolve(__dirname, 'waitlist.html')
      }
    }
  }
})

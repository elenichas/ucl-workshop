/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// `base` is the sub-path the site lives under once published.
// GitHub Pages serves a project site at https://<user>.github.io/<repo>/
// so the build needs to know the repo name. Locally it is just "/".
const base = process.env.GITHUB_PAGES ? '/ucl-workshop/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@course': path.resolve(__dirname, '../course'),
      // see src/lib/ws-stub.ts
      ws: path.resolve(__dirname, 'src/lib/ws-stub.ts'),
    },
  },
  server: {
    // the course chapters live one folder up, in ../course
    fs: { allow: ['..'] },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})

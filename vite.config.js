import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { readFileSync } from 'fs';

const manifest = JSON.parse(
  readFileSync('./public/manifest.json', 'utf-8')
);

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html'
      }
    }
  }
});
import {defineConfig} from 'vite';
import {resolve} from 'path';
import {readdirSync, copyFileSync, mkdirSync, existsSync} from 'fs';

// Get all article HTML files
const articles = readdirSync(resolve(__dirname, 'articles'))
  .filter(file => file.endsWith('.html'))
  .reduce((entries, file) => {
    const name = file.replace('.html', '');
    entries[`articles/${name}`] = resolve(__dirname, `articles/${file}`);
    return entries;
  }, {});

export default defineConfig({
  appType: 'mpa',
  server: {
    host: '0.0.0.0'
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        ...articles
      }
    }
  },
  plugins: [
    {
      name: 'copy-static-files',
      closeBundle() {
        const distPath = resolve(__dirname, 'dist');
        if (!existsSync(distPath)) {
          mkdirSync(distPath, { recursive: true });
        }
        // Copy ads.txt to dist root
        copyFileSync(
          resolve(__dirname, 'ads.txt'),
          resolve(distPath, 'ads.txt')
        );
        // Copy _redirects to dist root
        copyFileSync(
          resolve(__dirname, '_redirects'),
          resolve(distPath, '_redirects')
        );
      }
    }
  ]
});

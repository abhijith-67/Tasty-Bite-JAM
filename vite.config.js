import { defineConfig } from 'vite';
import nunjucks from 'nunjucks';
import fs from 'fs';
import path from 'path';

const pages = [
  { input: 'src/index.njk', output: 'index.html' },
  { input: 'src/about.njk', output: 'about.html' },
  { input: 'src/contact.njk', output: 'contact.html' }
];

export default defineConfig({
  assetsInclude: ['**/*.njk'],
  build: {
    rollupOptions: {
      input: 'index.html'
    }
  },
  plugins: [
    {
      name: 'nunjucks-static',
      apply: 'build',
      closeBundle() {
        nunjucks.configure('src', { autoescape: true });
        pages.forEach(page => {
          const template = fs.readFileSync(page.input, 'utf-8');
          const rendered = nunjucks.renderString(template);
          const outputPath = path.resolve('dist', page.output);
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, rendered);
          console.log(`✅ Rendered ${page.output}`);
        });
      }
    }
  ]
});

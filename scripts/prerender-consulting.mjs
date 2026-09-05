// Emit the same consulting page as HTML so its content and metadata are available
// before JavaScript runs. React mounts the complete application on the client.
import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import helmetPackage from 'react-helmet';

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
try {
  const { default: Consulting } = await server.ssrLoadModule('/src/pages/Consulting.jsx');
  const content = renderToString(React.createElement(StaticRouter, { location: '/consulting' }, React.createElement(Consulting)));
  const head = helmetPackage.Helmet.renderStatic();
  const template = await readFile('dist/index.html', 'utf8');
  const html = template
    .replace(/\s*<title[\s\S]*?<\/title>/g, '')
    .replace(/\s*<(?:meta|link)[^>]*data-react-helmet="true"[^>]*>/g, '')
    .replace('</head>', `${head.title.toString()}\n${head.meta.toString()}\n${head.link.toString()}\n${head.script.toString()}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  await writeFile('dist/consulting.html', html);
  console.log('Prerendered /consulting with page content, metadata, and structured data.');
} finally {
  await server.close();
}

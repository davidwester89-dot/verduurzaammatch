import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { layout, SITE } from './src/layout.mjs';
import * as P from './src/pages.mjs';
import { blogHub, blogPages } from './src/blog.mjs';
import { toolPages } from './src/tools.mjs';
const OUT = 'dist';
rmSync(OUT, { recursive: true, force: true });
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); };
export const pages = [P.home, P.quiz, P.subsidie, P.isde2027, P.glasisolatie, P.gidsHub, ...P.gidsPages, blogHub, ...blogPages, ...toolPages, P.over, P.bronnen, P.privacy, P.disclaimer, P.notfound];
// GitHub Pages kent geen server-side 301: oude URL's krijgen een doorverwijspagina (meta refresh 0 + canonical + noindex), buiten de sitemap.
export const REDIRECTS = [['/thuisbatterij-terugverdienen/', 'https://thuisaccumatch.nl/thuisaccu-terugverdientijd/', 'Thuisaccu terugverdientijd op ThuisaccuMatch']];
const redirectHtml = (to, label) => `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${to}">
<link rel="canonical" href="${to}">
<meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Verhuisd naar ThuisaccuMatch</title>
</head>
<body>
<p>Deze pagina is verhuisd. Ga naar <a href="${to}">${label}</a>.</p>
</body>
</html>
`;
for (const [from, to, label] of REDIRECTS) write(join(OUT, from, 'index.html'), redirectHtml(to, label));
for (const p of pages) write(p.path.endsWith('.html') ? join(OUT, p.path) : join(OUT, p.path, 'index.html'), layout(p));
cpSync('src/assets/js', join(OUT, 'js'), { recursive: true });
cpSync('src/lib', join(OUT, 'js/lib'), { recursive: true });
cpSync('src/assets/img', join(OUT, 'img'), { recursive: true });
cpSync('src/assets/og', join(OUT, 'og'), { recursive: true });
cpSync('src/assets/icons', OUT, { recursive: true });
cpSync('src/root', OUT, { recursive: true });
write(join(OUT, 'CNAME'), 'verduurzaammatch.nl\n');
write(join(OUT, 'google5be727237a44c762.html'), 'google-site-verification: google5be727237a44c762.html');
write(join(OUT, '.nojekyll'), '');
write(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);
write(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter((p) => !p.noindex).map((p) => `<url><loc>${SITE.domain}${p.path}</loc><lastmod>${p.lastmod || SITE.updated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${pages.length} pages → ${OUT}/`);

import { readdirSync, existsSync } from 'node:fs';
import { SITE, esc } from './layout.mjs';
const DIR = new URL('../content/blog/', import.meta.url);
const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith('.mjs')) : [];
export const POSTS = (await Promise.all(files.map(async (f) => (await import(new URL(f, DIR))).default)))
  .sort((a, b) => b.date.localeCompare(a.date));
const ORG = { '@type': 'Organization', name: SITE.name, url: SITE.domain + '/' };
const datum = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
const cta = `<div class="offerte"><h3>Welke stap past bij jouw huis?</h3><p>Vijf vragen, direct advies met kosten en terugverdientijd.</p><a class="btn sun" href="/verduurzaam-match/">Doe de VerduurzaamMatch</a></div>`;
export const blogPages = POSTS.map((b) => ({
  path: `/blog/${b.slug}/`, title: b.title, h1: b.title, crumb: b.title, description: b.description, og: b.image || 'home',
  parents: [['/blog/', 'Blog']], navPath: '/blog/', ogType: 'article', lastmod: b.date,
  schema: [{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: b.title, description: b.description, mainEntityOfPage: `${SITE.domain}/blog/${b.slug}/`, image: `${SITE.domain}/og/${b.image || 'home'}.png`, datePublished: b.date, dateModified: b.updated || b.date, author: { '@type': 'Organization', name: b.author || 'Redactie VerduurzaamMatch' }, publisher: ORG, inLanguage: 'nl' }],
  body: `<article><h1>${esc(b.title)}</h1>${b.image ? `<div class="hero-img"><img src="/img/${b.image}-1200.webp" srcset="/img/${b.image}-600.webp 600w, /img/${b.image}-1200.webp 1200w" sizes="(max-width:760px) 100vw, 740px" width="1200" height="630" alt="" fetchpriority="high"></div>` : ''}<p class="src">Door ${esc(b.author || 'Redactie VerduurzaamMatch')} · ${datum(b.date)}</p>${b.body}${cta}</article>`,
}));
export const blogHub = {
  path: '/blog/', title: 'Blog: nieuws over verduurzamen en subsidie', h1: 'Blog', crumb: 'Blog', og: 'home', noindex: POSTS.length === 0,
  description: 'Wekelijks nieuws en uitleg over isoleren, warmtepompen, zonnepanelen, thuisbatterijen en subsidie zoals de ISDE.',
  body: `<h1>Blog</h1>${POSTS.length ? `<div class="grid">${POSTS.map((b) => `<a class="card link" href="/blog/${b.slug}/">${b.image ? `<img src="/img/${b.image}-600.webp" width="600" height="315" alt="" loading="lazy">` : ''}<h2 class="h3">${esc(b.title)}</h2><p>${datum(b.date)} · ${esc(b.description)}</p></a>`).join('')}</div>` : '<p>Binnenkort verschijnt hier elke week een nieuw artikel. Lees intussen de <a href="/gidsen/">gidsen</a>.</p>'}`,
};

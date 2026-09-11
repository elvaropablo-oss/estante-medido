import { site } from '../../site.config.mjs';

const base = site.basePath;
const cleanPath = (path = '') => path.replace(/^\/+|\/+$/g, '');
const isActive = (pagePath, target) => {
  const current = cleanPath(pagePath);
  const section = cleanPath(target);
  return current === section || current.startsWith(`${section}/`);
};

export const linkButton = (path, label, quiet = false) =>
  `<a class="button${quiet ? ' button--quiet' : ''}" href="${base}${path}">${label}</a>`;

export const breadcrumbs = items =>
  `<nav class="breadcrumbs" aria-label="Migas de pan">${items.map((item, index) =>
    index === items.length - 1
      ? `<span aria-current="page">${item.label}</span>`
      : `<a href="${base}${item.path}">${item.label}</a>`
  ).join('<span aria-hidden="true">/</span>')}</nav>`;

export const hero = (kicker, title, intro, actions = '') =>
  `<section class="hero"><div class="hero-copy"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="lead">${intro}</p>${actions ? `<div class="actions">${actions}</div>` : ''}</div><div class="hero-plan" aria-hidden="true"><span class="plan-code">EM / 01</span><span class="plan-height">1800</span><i class="plan-side plan-side--left"></i><i class="plan-side plan-side--right"></i><i class="plan-shelf plan-shelf--one"></i><i class="plan-shelf plan-shelf--two"></i><i class="plan-shelf plan-shelf--three"></i><i class="plan-shelf plan-shelf--four"></i><b>4 × 18 mm</b><small>DESPIECE PREVIO</small></div></section>`;

export function renderPage(page) {
  const canonical = `${site.origin}${base}${page.path ? `${page.path}/` : ''}`;
  const schema = JSON.stringify(page.schema || {
    '@context': 'https://schema.org',
    '@type': page.tool ? 'WebApplication' : 'WebPage',
    name: page.h1,
    url: canonical,
    description: page.description,
    inLanguage: 'es-ES',
    ...(page.tool ? {
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      browserRequirements: 'Navegador web moderno con JavaScript',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }
    } : {})
  }).replace(/</g, '\\u003c');
  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${site.origin}${base}` },
      ...(page.path ? [{ '@type': 'ListItem', position: 2, name: page.h1, item: canonical }] : [])
    ]
  }).replace(/</g, '\\u003c');
  const pageClass = `page-${cleanPath(page.path).replaceAll('/', '-') || 'inicio'}`;
  const navLink = (path, label) => `<a href="${base}${path}"${isActive(page.path, path) ? ' aria-current="page"' : ''}>${label}</a>`;

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${page.title}</title><meta name="description" content="${page.description}"><meta name="robots" content="${page.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}"><link rel="canonical" href="${canonical}"><meta property="og:locale" content="es_ES"><meta property="og:site_name" content="${site.name}"><meta property="og:type" content="website"><meta property="og:title" content="${page.title}"><meta property="og:description" content="${page.description}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${page.title}"><meta name="twitter:description" content="${page.description}"><link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}assets/site.css"><script type="application/ld+json">${schema}</script><script type="application/ld+json">${breadcrumbSchema}</script><script type="module" src="${base}assets/app.js"></script><script type="module" src="${base}assets/visuals.js"></script><script type="module" src="${base}assets/quality-fixes.js"></script></head><body class="${pageClass}${page.tool ? ' page-tool' : ''}"><a class="skip-link" href="#contenido">Saltar al contenido</a><header class="site-header"><a class="brand" href="${base}" aria-label="EstanteMedido, inicio"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M5 4v28M31 4v28M5 9h26M5 18h26M5 27h26"/></svg><span>Estante<em>Medido</em></span></a><nav aria-label="Principal">${navLink('herramientas/', 'Herramientas')}${navLink('guias/medir-estanteria/', 'Guía')}${navLink('metodologia/', 'Método')}</nav></header><main id="contenido">${page.content}</main><footer><div><a class="footer-brand" href="${base}">EstanteMedido</a><p>Medidas y piezas antes de encender la sierra.</p></div><nav aria-label="Información"><a href="${base}metodologia/">Metodología</a><a href="${base}sobre/">Sobre</a><a href="${base}privacidad/">Privacidad</a></nav><p class="footer-note">Verifica unión, carga y escuadra antes de cortar.</p></footer></body></html>`;
}

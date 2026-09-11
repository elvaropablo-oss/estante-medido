import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from '../src/pages/pages.mjs';
import { renderPage } from '../src/templates/site.mjs';
import { site } from '../site.config.mjs';
import { applyAnalyticsConsent } from './analytics-consent.mjs';
import { applyShareableCalculations } from './shareable-calculations.mjs';
import { applyCalculationExplanations } from './calculation-explanations.mjs';

const verificationTag = '<meta name="google-site-verification" content="EwTiLP4eMZK5K7W9U_5tpM7cvJsn4ZaLvRwKYrmuuV0">';
const shareableForms = ['equal-form', 'fit-form', 'cut-form'];
const explanations = {
  'equal-form': {
    formula: 'altura libre = altura interior − reserva inferior − reserva superior − (nº baldas × grosor); hueco = altura libre ÷ (nº baldas + 1)',
    fields: [['innerHeight', 'Altura interior', 'cm'], ['shelfCount', 'Número de baldas'], ['shelfThickness', 'Grosor de balda', 'cm'], ['reserveBottom', 'Reserva inferior', 'cm'], ['reserveTop', 'Reserva superior', 'cm']],
    note: 'Las marcas de cada balda se construyen acumulando huecos iguales y el grosor de las baldas anteriores.'
  },
  'fit-form': {
    formula: 'altura mínima por hueco = alto del objeto + holgura; nº máximo de baldas = suelo((altura útil − altura mínima) ÷ (grosor de balda + altura mínima)); después se reparte el espacio restante por igual',
    fields: [['innerHeight', 'Altura interior', 'cm'], ['itemHeight', 'Alto del objeto', 'cm'], ['clearance', 'Holgura', 'cm'], ['shelfThickness', 'Grosor de balda', 'cm'], ['reserveBottom', 'Reserva inferior', 'cm'], ['reserveTop', 'Reserva superior', 'cm']],
    note: 'El número se redondea hacia abajo para garantizar que todos los objetos caben con la holgura solicitada.'
  },
  'cut-form': {
    formula: 'ancho interior = ancho exterior − 2 × grosor; alto interior = alto exterior − 2 × grosor; área total = suma(largo × ancho × cantidad) de todas las piezas',
    fields: [['outerWidth', 'Ancho exterior', 'cm'], ['outerHeight', 'Alto exterior', 'cm'], ['depth', 'Fondo', 'cm'], ['panelThickness', 'Grosor del tablero', 'cm'], ['shelfCount', 'Baldas interiores'], ['setback', 'Retranqueo de baldas', 'cm']],
    note: 'El despiece es geométrico: antes de cortar conviene añadir pérdidas, ancho de sierra, canteado y sentido de veta.'
  }
};
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'assets'), { recursive: true });
await cp(path.join(root, 'src/js'), path.join(dist, 'assets'), { recursive: true });
await cp(path.join(root, 'src/styles/site.css'), path.join(dist, 'assets/site.css'));
await cp(path.join(root, 'src/assets/favicon.svg'), path.join(dist, 'assets/favicon.svg'));

for (const page of pages) {
  const destination = page.output ? path.join(dist, page.output) : page.path ? path.join(dist, page.path, 'index.html') : path.join(dist, 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  let html = applyAnalyticsConsent(renderPage(page), {
    measurementId: 'G-SK1BZYCC1C',
    storageKey: 'em:v1:analytics-consent'
  });
  html = applyShareableCalculations(html, shareableForms);
  html = applyCalculationExplanations(html, explanations);
  if (page.path === '') html = html.replace('<head>', `<head>\n  ${verificationTag}`);
  await writeFile(destination, html, 'utf8');
}

const urls = pages.filter((page) => !page.noindex && page.path !== '404')
  .map((page) => `  <url><loc>${site.origin}${site.basePath}${page.path ? `${page.path}/` : ''}</loc></url>`)
  .join('\n');
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');
await writeFile(path.join(dist, '.nojekyll'), '', 'utf8');
console.log(`Built ${pages.length} pages in dist/`);

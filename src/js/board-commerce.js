import { boardCriteria, boardProducts, verifiedAt } from './products/board-products.js';
import { optimizeBoardCuts } from './math/cut-optimizer.js';

const engine=window.CommerceEngine;
const form=document.querySelector('#cut-form');
if(!engine||!form)throw new Error('CommerceEngine o formulario de corte no disponible');

const money=value=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(value);
const fmt=(value,digits=1)=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:digits}).format(value);
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let latestResult=null;

try{
  const saved=JSON.parse(localStorage.getItem('em:v1:last-result')||'null');
  if(saved?.type==='cut'&&Array.isArray(saved.parts))latestResult=saved;
}catch{}

function signalLoaded(){
  const status=document.querySelector('[data-board-commerce-status]');
  if(status)status.hidden=true;
}

function ensureStyles(){
  if(document.querySelector('link[data-board-commerce-style]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='/estante-medido/assets/commerce.css?v=20260912-3';
  link.dataset.boardCommerceStyle='';
  document.head.appendChild(link);
}

function ensureSection(){
  let section=document.querySelector('#board-commerce');
  if(section)return section;
  section=document.createElement('section');
  section.id='board-commerce';
  section.className='commerce';
  section.setAttribute('aria-labelledby','board-commerce-title');
  section.innerHTML=`
    <div class="commerce-head"><div><p class="eyebrow">Compra calculada</p><h2 id="board-commerce-title">Tableros reales para tu despiece</h2><p>Calculamos qué formatos comerciales pueden contener las piezas principales de tu lista, cuántos tableros necesitas, coste real y desperdicio estimado.</p></div>
      <label class="commerce-sort">Ordenar comparación<select data-commerce-sort><option value="value">Calidad-precio</option><option value="cost">Coste total</option><option value="waste">Menor desperdicio</option><option value="technical">Índice técnico</option></select></label>
    </div>
    <div class="commerce-featured" data-commerce-featured></div>
    <div class="commerce-controls"><label>Ancho de corte<input data-kerf value="0,3" inputmode="decimal"><span>cm</span></label><label class="commerce-check"><input type="checkbox" data-rotate> Permitir girar piezas 90°</label></div>
    <div class="commerce-status" data-commerce-status></div>
    <div class="commerce-winners" data-commerce-winners></div>
    <div class="commerce-products" data-commerce-products></div>
    <div class="commerce-method"><details><summary>Cómo calculamos coste, desperdicio y calidad-precio</summary><p>El optimizador coloca las piezas en formatos comerciales respetando grosor y ancho de corte. La puntuación económica usa el coste total de los tableros enteros necesarios. El índice técnico documental usa cinco comprobaciones verificables: aptitud para mobiliario, preparación de superficie, origen certificado, bajas emisiones/ausencia de sustancias peligrosas y resistencia o estabilidad declarada.</p><p>Calidad-precio combina un 55 % de economía y un 45 % de índice técnico cuando al menos el 60 % de los criterios técnicos dispone de datos. La distribución es una estimación geométrica de corte, no un plano profesional: no considera veta, canteado, defectos, mecanizados ni tolerancias de montaje. El giro está desactivado por defecto para no ignorar el sentido de veta.</p></details><p class="commerce-disclosure">Precios comprobados el ${verifiedAt.split('-').reverse().join('/')}; pueden cambiar y no incluyen transporte ni servicio de corte. Los enlaces son oficiales. La afiliación, cuando se active con enlaces reales, no cambiará el ranking. <a href="/afiliacion.html" target="_blank" rel="noopener noreferrer">Cómo funciona la afiliación</a>.</p></div>`;
  document.querySelector('.tool-layout')?.insertAdjacentElement('afterend',section);
  section.querySelector('[data-commerce-sort]')?.addEventListener('change',render);
  section.querySelector('[data-kerf]')?.addEventListener('input',render);
  section.querySelector('[data-rotate]')?.addEventListener('change',render);
  return section;
}

function kerfValue(section){const raw=String(section.querySelector('[data-kerf]')?.value||'0').replace(',','.');const value=Number.parseFloat(raw);return Number.isFinite(value)&&value>=0?value:0;}
function sortRows(rows,mode){const list=[...rows];if(mode==='cost')return list.sort((a,b)=>a.purchase.projectCost-b.purchase.projectCost);if(mode==='waste')return list.sort((a,b)=>a.purchase.waste-b.purchase.waste||a.purchase.projectCost-b.purchase.projectCost);if(mode==='technical')return list.sort((a,b)=>(b.technical?.score??-1)-(a.technical?.score??-1)||a.purchase.projectCost-b.purchase.projectCost);return list.sort((a,b)=>(b.valueScore??-1)-(a.valueScore??-1)||a.purchase.projectCost-b.purchase.projectCost);}
function winner(label,row,metric){return row?`<article><span>${esc(label)}</span><b>${esc(row.name)}</b><strong>${esc(metric)}</strong></article>`:'';}
function knownSpecs(row){return boardCriteria.filter(c=>row.specs?.[c.key]!==null&&row.specs?.[c.key]!==undefined).map(c=>({label:c.label,value:row.specs[c.key]===true?'Sí':'No'}));}

function featuredCard(row){
  if(!row)return `<div class="commerce-empty"><strong>Genera tu lista de corte</strong><span>Después calcularemos qué tableros de 18 mm pueden contener realmente las piezas y cuál sale mejor para tu proyecto.</span><a class="button button--commerce" href="#cut-form">Ir al despiece</a></div>`;
  const score=row.valueScore!==null?`${fmt(row.valueScore,0)}/100`:'Sin nota';
  const reason=row.valueScore!==null?'Mejor equilibrio calculado entre coste real del proyecto e índice técnico documentado.':'Opción compatible destacada por coste y aprovechamiento; faltan datos técnicos para una nota completa.';
  return `<article class="commerce-featured-card">
    <div class="commerce-featured-kicker">Recomendado para tu despiece</div>
    <div class="commerce-featured-grid">
      <div><small>${esc(row.retailer)} · precio comprobado ${verifiedAt.split('-').reverse().join('/')}</small><h3>${esc(row.name)}</h3><p>${esc(reason)} Necesitas ${row.purchase.units} ${row.purchase.units===1?'tablero':'tableros'} y el desperdicio geométrico estimado es ${fmt(row.purchase.wastePct,1)} %.</p></div>
      <div class="commerce-featured-score"><b>${score}</b><span>calidad-precio</span></div>
    </div>
    <div class="commerce-featured-bottom"><div><strong>${money(row.purchase.projectCost)}</strong><span>coste estimado para completar tu despiece</span></div><a class="button button--commerce commerce-featured-link" data-product-link="${esc(row.id)}" href="${esc(row.link.url)}" target="_blank" rel="${row.link.affiliate?'sponsored noopener noreferrer':'noopener noreferrer'}">Ver producto y precio actual ↗</a></div>
  </article>`;
}

function card(row,winners){
  const badges=[];
  if(winners.cheapest?.id===row.id)badges.push('Menor coste');
  if(winners.leastWaste?.id===row.id)badges.push('Menor desperdicio');
  if(winners.bestValue?.id===row.id)badges.push('Mejor calidad-precio');
  if(winners.bestTechnical?.id===row.id)badges.push('Mejor índice técnico');
  const value=row.valueScore!==null?`${fmt(row.valueScore,0)}/100`:'Sin nota';
  const technical=row.technical?.score!==null?`${fmt(row.technical.score,0)}/100`:'—';
  const coverage=Math.round((row.technical?.coverage||0)*100);
  return `<article class="commerce-card${winners.bestValue?.id===row.id?' commerce-card--best':''}">
    <div class="commerce-card-top"><div><div class="commerce-badges">${badges.map(x=>`<span>${esc(x)}</span>`).join('')}</div><small>${esc(row.retailer)} · ${fmt(row.length,0)} × ${fmt(row.width,0)} × ${fmt(row.thickness,1)} cm</small><h3>${esc(row.name)}</h3></div><div class="commerce-score"><b>${value}</b><span>calidad-precio</span></div></div>
    <div class="commerce-price"><strong>${money(row.purchase.projectCost)}</strong><span>${row.purchase.units} ${row.purchase.units===1?'tablero':'tableros'} · ${money(row.price)} / ud.</span></div>
    <dl class="commerce-metrics"><div><dt>Desperdicio estimado</dt><dd>${fmt(row.purchase.wastePct,1)} %</dd></div><div><dt>Área sobrante</dt><dd>${fmt(row.purchase.waste,2)} m²</dd></div><div><dt>Precio tablero</dt><dd>${money(row.price)}</dd></div><div><dt>Índice técnico</dt><dd>${technical}</dd></div></dl>
    <div class="commerce-features">${(row.featureLabels||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div>
    <details class="commerce-tech"><summary>Ver criterios técnicos (${coverage}% documentado)</summary><ul>${knownSpecs(row).map(item=>`<li><span>${esc(item.label)}</span><b>${esc(item.value)}</b></li>`).join('')}</ul></details>
    <a class="button button--commerce commerce-link" data-product-link="${esc(row.id)}" href="${esc(row.link.url)}" target="_blank" rel="${row.link.affiliate?'sponsored noopener noreferrer':'noopener noreferrer'}">Ver producto y precio actual en ${esc(row.retailer)} ↗</a>
  </article>`;
}

function attachTracking(section,rows,kerf){
  section.querySelectorAll('[data-product-link]').forEach(anchor=>anchor.addEventListener('click',()=>{
    const product=boardProducts.find(item=>item.id===anchor.dataset.productLink);
    const row=rows.find(item=>item.id===product?.id);
    if(product&&row)engine.track('board_product_open',product,{boards:row.purchase.units,project_cost:row.purchase.projectCost,waste_pct:row.purchase.wastePct,panel_thickness:latestResult?.thickness||null,kerf_cm:kerf});
  }));
}

function render(){
  ensureStyles();
  const section=ensureSection();
  signalLoaded();
  const featured=section.querySelector('[data-commerce-featured]'),status=section.querySelector('[data-commerce-status]'),productsHost=section.querySelector('[data-commerce-products]'),winnersHost=section.querySelector('[data-commerce-winners]');
  if(!latestResult){featured.innerHTML=featuredCard(null);status.innerHTML='<p>Genera una lista de corte para activar la comparación con tus medidas.</p>';productsHost.innerHTML='';winnersHost.innerHTML='';return;}
  const kerf=kerfValue(section),allowRotate=section.querySelector('[data-rotate]')?.checked===true;
  const rows=engine.rank(boardProducts,{calculate:product=>{const result=optimizeBoardCuts(latestResult.parts,product,{targetThickness:latestResult.thickness,kerf,allowRotate});return result.compatible?{units:result.units,purchased:result.purchasedArea,waste:result.wasteArea,projectCost:result.projectCost,unitCost:result.unitCost,wastePct:result.wastePct,pieceArea:result.pieceArea,purchasedArea:result.purchasedArea,boards:result.boards}:null;},technicalCriteria:boardCriteria,economyWeight:.55,technicalWeight:.45,minimumTechnicalCoverage:.6});
  const backParts=latestResult.parts.filter(part=>Math.abs(Number(part.thickness)-Number(latestResult.thickness))>0.011);
  if(!rows.length){featured.innerHTML=`<div class="commerce-empty commerce-empty--warning"><strong>No hay un tablero compatible en el catálogo actual</strong><span>Buscamos exactamente ${fmt(latestResult.thickness,1)} cm de grosor y piezas que quepan físicamente en el formato; no cambiamos tus medidas para forzar una recomendación.</span></div>`;status.innerHTML='';productsHost.innerHTML='';winnersHost.innerHTML='';return;}
  const winners=engine.winners(rows),ordered=sortRows(rows,section.querySelector('[data-commerce-sort]')?.value||'value');
  const recommended=winners.bestValue||winners.cheapest||ordered[0];
  featured.innerHTML=featuredCard(recommended);
  status.innerHTML=`<div><span>Área de piezas principales</span><b>${fmt(rows[0].purchase.pieceArea,2)} m²</b></div><div><span>Grosor buscado</span><b>${fmt(latestResult.thickness,1)} cm</b></div><div><span>Ancho de corte</span><b>${fmt(kerf,2)} cm</b></div><div><span>Productos compatibles</span><b>${rows.length}</b></div>${backParts.length?'<p>La trasera se excluye de esta comparación porque usa un grosor distinto al tablero principal.</p>':''}`;
  winnersHost.innerHTML=[winner('Menor coste',winners.cheapest,winners.cheapest?money(winners.cheapest.purchase.projectCost):''),winner('Menor desperdicio',winners.leastWaste,winners.leastWaste?`${fmt(winners.leastWaste.purchase.wastePct,1)} %`:''),winner('Mejor calidad-precio',winners.bestValue,winners.bestValue?`${fmt(winners.bestValue.valueScore,0)}/100`:''),winner('Mejor índice técnico',winners.bestTechnical,winners.bestTechnical?`${fmt(winners.bestTechnical.technical.score,0)}/100`:'')].join('');
  productsHost.innerHTML=`<div class="commerce-list-heading"><span>Comparación completa</span><strong>${rows.length} opciones compatibles</strong></div>${ordered.map(row=>card(row,winners)).join('')}`;
  attachTracking(section,rows,kerf);
}

document.addEventListener('estante:cut-result',event=>{latestResult=event.detail;render();document.querySelector('#board-commerce')?.scrollIntoView({behavior:'smooth',block:'start'});});
ensureSection();
render();

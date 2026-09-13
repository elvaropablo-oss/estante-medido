const style=document.createElement('style');
style.textContent=`
.input-row input:focus-visible,.input-row select:focus-visible,.input-row textarea:focus-visible{outline:none!important;box-shadow:none!important}
.input-row:focus-within{outline:2px solid currentColor!important;outline-offset:2px;box-shadow:none!important}
footer .analytics-consent__settings{color:inherit!important}
.eyebrow{color:#b43b12!important}
.plan-height{color:#7a2b0d!important}
`;
document.head.appendChild(style);
function keepLauncherClear(){const button=document.querySelector('.project-library-launcher');const nav=document.querySelector('.site-header nav');if(button&&nav&&button.parentElement!==nav)nav.append(button)}
function addPortfolioHubLink(){const f=document.querySelector('footer');if(!f||f.querySelector('[data-portfolio-hub]'))return;const host=f.querySelector('nav')||f;const a=document.createElement('a');a.href='https://elvaropablo-oss.github.io/';a.textContent='Todas las herramientas';a.dataset.portfolioHub='';a.setAttribute('aria-label','Ver todas las herramientas de la colección');host.appendChild(a)}
function loadMonetization(){if(document.querySelector('script[src*="/assets/monetization.js"]'))return;const s=document.createElement('script');s.src='/assets/monetization.js?v=20260912-2';s.defer=true;document.head.appendChild(s)}
function setBoardStatus(message,{error=false,hidden=false}={}){const status=document.querySelector('[data-board-commerce-status]');if(!status)return;status.hidden=hidden;if(message)status.textContent=message;if(error)status.dataset.error='true';else delete status.dataset.error}
function loadBoardCommerce(){
  if(!document.querySelector('#cut-form'))return;
  setBoardStatus('Cargando catálogo y comparador de tableros…');
  const start=()=>import('./board-commerce.js?v=20260912-3').catch(error=>{console.error('No se pudo cargar el comparador de tableros',error);setBoardStatus('No se pudo cargar el comparador. Recarga la página; la lista de corte sigue funcionando.',{error:true})});
  if(window.CommerceEngine){start();return}
  const existing=document.querySelector('script[src*="/assets/commerce-engine.js"]');
  if(existing){existing.addEventListener('load',start,{once:true});existing.addEventListener('error',()=>setBoardStatus('No se pudo cargar el motor de comparación. Recarga la página.',{error:true}),{once:true});return}
  const s=document.createElement('script');s.src='/assets/commerce-engine.js?v=20260912-1';s.onload=start;s.onerror=()=>{console.error('No se pudo cargar CommerceEngine');setBoardStatus('No se pudo cargar el motor de comparación. Recarga la página.',{error:true})};s.defer=true;document.head.appendChild(s)
}
new MutationObserver(keepLauncherClear).observe(document.body,{childList:true,subtree:true});addPortfolioHubLink();keepLauncherClear();loadMonetization();loadBoardCommerce();

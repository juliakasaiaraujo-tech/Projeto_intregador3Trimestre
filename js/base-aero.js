/* Sol+Água Aero v6 · tecla E abre/fecha o painel · Tab sempre livre · VLibras garantido */
window.coresGraf = function () {
  var cs = getComputedStyle(document.body);
  return {
    a: cs.getPropertyValue('--g-a').trim() || '#7fdcff',
    b: cs.getPropertyValue('--g-b').trim() || '#59c214',
    c: cs.getPropertyValue('--g-c').trim() || '#ffb08a',
    alvo: cs.getPropertyValue('--g-alvo').trim() || '#ff9a2e',
    fundo: cs.getPropertyValue('--g-fundo').trim() || '#062733',
    grade: cs.getPropertyValue('--g-grade').trim() || 'rgba(157,238,243,.25)',
    texto: cs.getPropertyValue('--g-texto').trim() || '#9deef3'
  };
};
(function () {
  const $ = id => document.getElementById(id);
  let estado = {};
  try { estado = JSON.parse(localStorage.getItem('solagua') || '{}'); } catch (e) { estado = {}; }

  function aplicar() {
    document.body.classList.toggle('hc', !!estado.hc);
    document.body.classList.toggle('fdx', !!estado.fdx);
    document.body.classList.toggle('esp', !!estado.esp);
    document.body.classList.toggle('sem-anim', !!estado.sem);
    document.documentElement.style.fontSize = (estado.fs || 100) + '%';
    if (estado.sem) document.querySelectorAll('.reveal').forEach(r => r.classList.add('visivel'));
    [['btn-hc','hc'],['btn-fdx','fdx'],['btn-esp','esp'],['btn-sem','sem']].forEach(par => {
      const b = $(par[0]); if (b) b.setAttribute('aria-pressed', String(!!estado[par[1]]));
    });
  }
  function salvar() { localStorage.setItem('solagua', JSON.stringify(estado)); aplicar(); }

  function garantirPainel() {
    if (!$('btn-acess')) {
      const b = document.createElement('button');
      b.id = 'btn-acess'; b.className = 'btn-flutuante';
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-controls', 'painel-acess');
      b.title = 'Abrir opções de acessibilidade (tecla E)';
      b.textContent = '♿';
      document.body.appendChild(b);
    }
    if (!$('painel-acess')) {
      const p = document.createElement('div');
      p.id = 'painel-acess'; p.className = 'painel-acess';
      p.setAttribute('role', 'dialog');
      p.setAttribute('aria-label', 'Opções de acessibilidade');
      p.setAttribute('hidden', '');
      p.innerHTML =
        '<h2>♿ Acessibilidade</h2>' +
        '<button id="btn-hc" class="pa-btn" aria-pressed="false">🌗 Alto contraste</button>' +
        '<button id="btn-fdx" class="pa-btn" aria-pressed="false">🔤 Fonte para dislexia</button>' +
        '<button id="btn-a+" class="pa-btn">A+ Aumentar texto</button>' +
        '<button id="btn-a-" class="pa-btn">A− Diminuir texto</button>' +
        '<button id="btn-esp" class="pa-btn" aria-pressed="false">↔️ Mais espaçamento</button>' +
        '<button id="btn-sem" class="pa-btn" aria-pressed="false">🐢 Reduzir animações</button>' +
        '<button id="btn-reset" class="pa-btn">↩️ Restaurar padrão</button>' +
        '<p class="pa-nota"></p>';
      document.body.appendChild(p);
    }
  }

  function garantirVLibras() {
    if (!document.querySelector('div[vw]')) {
      const vw = document.createElement('div');
      vw.setAttribute('vw', ''); vw.className = 'enabled';
      vw.innerHTML = '<div access="true"></div>';
      document.body.appendChild(vw);
    }
    function boot() {
      if (window.__vlOK) return;
      try { if (window.VLibras) { new VLibras.Widget('https://vlibras.gov.br/app'); window.__vlOK = true; } } catch (e) {}
    }
    window.addEventListener('load', function () {
      boot();
      if (!window.__vlOK) {
        if (!document.querySelector('script[src*="vlibras-plugin"]')) {
          const s = document.createElement('script');
          s.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
          s.onload = boot; document.body.appendChild(s);
        }
        var t = setInterval(function () { boot(); if (window.__vlOK) clearInterval(t); }, 1500);
        setTimeout(function () { clearInterval(t); }, 15000);
      }
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    garantirPainel();
    aplicar();

    const painel = $('painel-acess'), abre = $('btn-acess');
    /* atualiza o texto de ajuda em TODAS as páginas (mesmo nas que já tinham painel no HTML) */
    const nota = painel.querySelector('.pa-nota');
    if (nota) nota.textContent = 'Tecla E abre/fecha · Esc fecha · Tab navega livre pela página. VLibras no botão azul à direita.';
    abre.title = 'Abrir opções de acessibilidade (tecla E)';

    let ultimoFoco = null;
    function estaAberto() { return !painel.hasAttribute('hidden'); }
    function abrir() {
      ultimoFoco = document.activeElement;
      painel.removeAttribute('hidden');
      painel.classList.remove('abrindo'); void painel.offsetWidth; painel.classList.add('abrindo');
      abre.setAttribute('aria-expanded', 'true'); abre.textContent = '✖';
      abre.title = 'Fechar opções de acessibilidade (tecla E)';
      const f = painel.querySelector('button'); if (f) f.focus();
    }
    function fechar() {
      painel.setAttribute('hidden', '');
      abre.setAttribute('aria-expanded', 'false'); abre.textContent = '♿';
      abre.title = 'Abrir opções de acessibilidade (tecla E)';
      if (ultimoFoco && document.contains(ultimoFoco) && ultimoFoco !== document.body) ultimoFoco.focus();
      else abre.focus();
      ultimoFoco = null;
    }

    abre.addEventListener('click', () => estaAberto() ? fechar() : abrir());

    /* TECLA E abre/fecha · ESC apenas fecha · SEM trap: o Tab anda livre */
    document.addEventListener('keydown', function (e) {
      const el = document.activeElement;
      const tag = el ? el.tagName : '';
      const digitando = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable);
      if ((e.key === 'e' || e.key === 'E') && !e.ctrlKey && !e.metaKey && !e.altKey && !digitando) {
        e.preventDefault();
        estaAberto() ? fechar() : abrir();
        return;
      }
      if (e.key === 'Escape' && estaAberto()) { fechar(); }
    });

    const liga = (id, fn) => { const b = $(id); if (b) b.addEventListener('click', fn); };
    liga('btn-hc',  () => { estado.hc=!estado.hc; salvar(); });
    liga('btn-fdx', () => { estado.fdx=!estado.fdx; salvar(); });
    liga('btn-esp', () => { estado.esp=!estado.esp; salvar(); });
    liga('btn-sem', () => { estado.sem=!estado.sem; salvar(); });
    liga('btn-a+',  () => { estado.fs=Math.min(130,(estado.fs||100)+10); salvar(); });
    liga('btn-a-',  () => { estado.fs=Math.max(85,(estado.fs||100)-10); salvar(); });
    liga('btn-reset', () => { localStorage.removeItem('solagua'); location.reload(); });

    const topo = document.querySelector('.topo'), tog = $('btn-menu');
    if (tog && topo) tog.addEventListener('click', () => { const a=topo.classList.toggle('aberto'); tog.setAttribute('aria-expanded',String(a)); });
    const ano = $('ano'); if (ano) ano.textContent = new Date().getFullYear();

    const revs = [...document.querySelectorAll('.reveal')];
    const sem = document.body.classList.contains('sem-anim');
    if (sem || !('IntersectionObserver' in window)) revs.forEach(r => r.classList.add('visivel'));
    else {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); } }), { threshold: .12 });
      revs.forEach(r => io.observe(r));
    }
    garantirVLibras();
  });
})();
/* 🐠 aquário de fundo */
(function(){
  if (document.getElementById('mundo-agua')) return;
  var st=document.createElement('style');
  st.textContent=
   '#mundo-agua{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none}'+
   '#mundo-agua .peixe{position:absolute;transform:scaleX(-1);opacity:.9;filter:drop-shadow(0 3px 4px rgba(0,60,110,.25))}'+
   '#mundo-agua .peixe.esq{transform:none}'+
   '#mundo-agua .peixe.dourado{filter:sepia(1) saturate(3.2) hue-rotate(-12deg) brightness(1.1)}'+
   '#mundo-agua .peixe>span{display:inline-block}'+
   '#mundo-agua .bolha-f{position:absolute;border-radius:50%;background:radial-gradient(circle at 32% 30%,rgba(255,255,255,.95),rgba(255,255,255,.2) 42%,rgba(120,200,255,.15) 60%,rgba(255,255,255,.45));border:1px solid rgba(255,255,255,.6)}';
  document.head.appendChild(st);
  var mundo=document.createElement('div'); mundo.id='mundo-agua'; document.body.appendChild(mundo);
  var anims=[]; function reg(a){ if(a) anims.push(a); }
  ['🐠','🐟','🐠','🐡','🐟','🐠','🐟'].forEach(function(e,i){
    var p=document.createElement('span'); var esq=i%2===1;
    p.className='peixe'+(esq?' esq':'')+(e==='🐟'?' dourado':'');
    p.innerHTML='<span>'+e+'</span>';
    p.style.top=(55+Math.random()*35)+'%'; p.style.fontSize=(22+Math.random()*22)+'px'; p.style.left=esq?'112%':'-12%';
    mundo.appendChild(p);
    if(p.animate){
      var dur=24000+Math.random()*26000;
      reg(p.animate(esq?[{left:'112%'},{left:'-12%'}]:[{left:'-12%'},{left:'112%'}],{duration:dur,iterations:Infinity,delay:-Math.random()*dur}));
      reg(p.firstChild.animate([{transform:'translateY(-6px)'},{transform:'translateY(6px)'}],{duration:2600+Math.random()*1400,iterations:Infinity,direction:'alternate',easing:'ease-in-out'}));
    } else p.style.left=(5+Math.random()*85)+'%';
  });
  for(var i=0;i<14;i++){
    var b=document.createElement('span'); b.className='bolha-f';
    var s=6+Math.random()*16; b.style.width=b.style.height=s+'px'; b.style.left=Math.random()*100+'%'; b.style.bottom='-40px';
    mundo.appendChild(b);
    if(b.animate){ var d=9000+Math.random()*10000; reg(b.animate([{transform:'translateY(0)'},{transform:'translateY(-115vh)'}],{duration:d,iterations:Infinity,delay:-Math.random()*d,easing:'linear'})); }
    else b.style.bottom=(Math.random()*85)+'%';
  }
  function sinc(){ var sem=document.body.classList.contains('sem-anim'); anims.forEach(function(a){ sem?a.pause():a.play(); }); }
  new MutationObserver(sinc).observe(document.body,{attributes:true,attributeFilter:['class']});
  sinc();
})();

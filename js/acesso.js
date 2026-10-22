/* =========================================================
   Sol+Água · acesso.js — painel de acessibilidade persistente
   (alto contraste, fonte p/ dislexia, tamanho de texto,
   espaçamento, menos animações) + menu mobile
   ========================================================= */
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
    [['btn-hc','hc'],['btn-fdx','fdx'],['btn-esp','esp'],['btn-sem','sem']].forEach(function (par) {
      const b = $(par[0]); if (b) b.setAttribute('aria-pressed', String(!!estado[par[1]]));
    });
  }
  function salvar() { localStorage.setItem('solagua', JSON.stringify(estado)); aplicar(); }

  window.addEventListener('DOMContentLoaded', function () {
    aplicar();

    const painel = $('painel-acess'), abre = $('btn-acess');
    function fechar() { painel.setAttribute('hidden', ''); abre.setAttribute('aria-expanded', 'false'); }
    if (abre && painel) {
      abre.addEventListener('click', function () {
        if (painel.hasAttribute('hidden')) {
          painel.removeAttribute('hidden');
          abre.setAttribute('aria-expanded', 'true');
          const primeiro = painel.querySelector('button'); if (primeiro) primeiro.focus();
        } else { fechar(); abre.focus(); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !painel.hasAttribute('hidden')) { fechar(); abre.focus(); }
      });
    }

    const liga = (id, fn) => { const b = $(id); if (b) b.addEventListener('click', fn); };
    liga('btn-hc',  () => { estado.hc  = !estado.hc;  salvar(); });
    liga('btn-fdx', () => { estado.fdx = !estado.fdx; salvar(); });
    liga('btn-esp', () => { estado.esp = !estado.esp; salvar(); });
    liga('btn-sem', () => { estado.sem = !estado.sem; salvar(); });
    liga('btn-a+',  () => { estado.fs = Math.min(130, (estado.fs || 100) + 10); salvar(); });
    liga('btn-a-',  () => { estado.fs = Math.max(85,  (estado.fs || 100) - 10); salvar(); });
    liga('btn-reset', () => { localStorage.removeItem('solagua'); location.reload(); });

    const topo = document.querySelector('.topo'), tog = $('btn-menu');
    if (tog && topo) tog.addEventListener('click', function () {
      const a = topo.classList.toggle('aberto');
      tog.setAttribute('aria-expanded', String(a));
    });

    const ano = $('ano'); if (ano) ano.textContent = new Date().getFullYear();
  });
})();

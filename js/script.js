// menu mobile (hamburger)
const hamburger = document.getElementById('hamburger');
const menuMobile = document.getElementById('menu-mobile');
if (hamburger && menuMobile) {
  hamburger.addEventListener('click', () => {
    const aperto = menuMobile.classList.toggle('aperto');
    hamburger.setAttribute('aria-expanded', aperto ? 'true' : 'false');
    document.body.style.overflow = aperto ? 'hidden' : '';
  });
  menuMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuMobile.classList.remove('aperto');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// copia del codice fiscale (può essere presente più volte in pagina)
document.querySelectorAll('.copia').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const targetId = btn.getAttribute('data-target') || 'codice';
    const cf = document.getElementById(targetId).textContent.trim();
    try {
      await navigator.clipboard.writeText(cf);
    } catch (e) {
      const t = document.createElement('textarea');
      t.value = cf; document.body.appendChild(t); t.select();
      document.execCommand('copy'); t.remove();
    }
    const esito = btn.parentElement.querySelector('.esito');
    if (esito) {
      esito.textContent = 'Copiato';
      setTimeout(() => esito.textContent = '', 2500);
    }
  });
});

// comparsa in dissolvenza, disattivata se l'utente preferisce meno movimento
const menoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!menoMovimento && 'IntersectionObserver' in window) {
  const osservatore = new IntersectionObserver((voci) => {
    voci.forEach(v => { if (v.isIntersecting) { v.target.classList.add('visibile'); osservatore.unobserve(v.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.appare').forEach(el => osservatore.observe(el));
} else {
  document.querySelectorAll('.appare').forEach(el => el.classList.add('visibile'));
}

// modulo di contatto: al momento non c'è un servizio collegato,
// quindi si limita ad aprire un'email precompilata (mailto).
// Da sostituire con un vero invio quando si sceglie una piattaforma.
const formContatti = document.getElementById('form-contatti');
if (formContatti) {
  formContatti.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('f-nome').value;
    const email = document.getElementById('f-email').value;
    const messaggio = document.getElementById('f-messaggio').value;
    const corpo = encodeURIComponent(`${messaggio}\n\n— ${nome} (${email})`);
    window.location.href = `mailto:fondazionedevirgiliis@gmail.com?subject=Messaggio dal sito&body=${corpo}`;
  });
}

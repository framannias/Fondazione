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

// comparsa in dissolvenza (sezioni) e comparsa progressiva della timeline,
// disattivate se l'utente preferisce meno movimento
const menoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!menoMovimento && 'IntersectionObserver' in window) {
  const osservatore = new IntersectionObserver((voci) => {
    voci.forEach(v => { if (v.isIntersecting) { v.target.classList.add('visibile'); osservatore.unobserve(v.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.appare').forEach(el => osservatore.observe(el));

  // le tappe della timeline compaiono una alla volta, con un piccolo ritardo in sequenza
  document.querySelectorAll('.tappa').forEach((tappa, i) => {
    tappa.style.transitionDelay = `${Math.min(i, 4) * 90}ms`;
  });
  const osservatoreTappe = new IntersectionObserver((voci) => {
    voci.forEach(v => { if (v.isIntersecting) { v.target.classList.add('visibile'); osservatoreTappe.unobserve(v.target); } });
  }, { threshold: .2 });
  document.querySelectorAll('.tappa').forEach(el => osservatoreTappe.observe(el));
} else {
  document.querySelectorAll('.appare, .tappa').forEach(el => el.classList.add('visibile'));
}

// timeline della storia: la linea verticale si "disegna" seguendo lo scroll
const timelineEl = document.querySelector('.timeline');
if (timelineEl) {
  if (menoMovimento) {
    timelineEl.style.setProperty('--progresso-linea', '1');
  } else {
    let tick = false;
    const aggiornaLinea = () => {
      const rect = timelineEl.getBoundingClientRect();
      const partenza = window.innerHeight * 0.85;
      let progresso = (partenza - rect.top) / rect.height;
      progresso = Math.max(0, Math.min(1, progresso));
      timelineEl.style.setProperty('--progresso-linea', progresso.toFixed(3));
      tick = false;
    };
    aggiornaLinea();
    window.addEventListener('scroll', () => {
      if (!tick) { tick = true; requestAnimationFrame(aggiornaLinea); }
    }, { passive: true });
    window.addEventListener('resize', aggiornaLinea);
  }
}

// selettore lingua IT/EN: scambia il testo degli elementi che hanno
// sia data-it che data-en; la scelta resta salvata per le pagine successive
const langBtns = document.querySelectorAll('.lang-switch');
function applicaLingua(lang) {
  document.querySelectorAll('[data-it][data-en]').forEach(el => {
    el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-it');
  });
  document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'it');
  langBtns.forEach(b => {
    b.querySelector('.lang-label').textContent = lang === 'en' ? 'IT' : 'EN';
    b.querySelector('.bandiera').textContent = lang === 'en' ? '🇮🇹' : '🇬🇧';
    b.setAttribute('aria-label', lang === 'en' ? 'Passa all\'italiano' : 'Switch to English');
  });
  try { localStorage.setItem('lingua-sito', lang); } catch (e) {}
}
if (langBtns.length) {
  let linguaSalvata = 'it';
  try { linguaSalvata = localStorage.getItem('lingua-sito') || 'it'; } catch (e) {}
  applicaLingua(linguaSalvata);
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const attuale = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'it';
      applicaLingua(attuale === 'en' ? 'it' : 'en');
    });
  });
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

const body = document.body;
const switcher = document.querySelector('.lang-switch');
const initialLanguage = new URLSearchParams(location.search).get('lang');
let language = initialLanguage === 'hi' ? 'hi' : 'en';

function setLanguage(lang, updateUrl = true) {
  language = lang;
  body.classList.toggle('hi', lang === 'hi');
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach(el => { el.textContent = el.dataset[lang]; });
  switcher.querySelectorAll('span').forEach((el, i) => el.classList.toggle('active', (lang === 'en' && i === 0) || (lang === 'hi' && i === 1)));
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.pushState({ lang }, '', url);
  }
}
switcher.addEventListener('click', () => setLanguage(language === 'en' ? 'hi' : 'en'));
setLanguage(language, !['en', 'hi'].includes(initialLanguage));

addEventListener('popstate', () => {
  const urlLanguage = new URLSearchParams(location.search).get('lang');
  setLanguage(urlLanguage === 'hi' ? 'hi' : 'en', false);
});

const music = document.querySelector('#wedding-music');
const musicToggle = document.querySelector('.music-toggle');
const welcomeGate = document.querySelector('.welcome-gate');
const welcomeButton = document.querySelector('.welcome-button');
music.volume = 0.16;

function syncMusicButton() {
  const isPlaying = !music.paused;
  musicToggle.classList.toggle('is-paused', !isPlaying);
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
  musicToggle.title = isPlaying ? 'Pause music' : 'Play music';
}

async function startMusic() {
  try {
    await music.play();
    welcomeGate.hidden = true;
  } catch (_) {
    welcomeGate.hidden = false;
  }
  syncMusicButton();
}

welcomeButton.addEventListener('click', async () => {
  try { await music.play(); } catch (_) { /* The fixed music button remains available. */ }
  welcomeGate.classList.add('is-closing');
  setTimeout(() => { welcomeGate.hidden = true; }, 650);
  syncMusicButton();
});

musicToggle.addEventListener('click', async () => {
  if (music.paused) {
    delete music.dataset.userPaused;
    await startMusic();
  } else {
    music.dataset.userPaused = 'true';
    music.pause();
  }
  syncMusicButton();
});

music.addEventListener('play', syncMusicButton);
music.addEventListener('pause', syncMusicButton);
startMusic();

document.addEventListener('pointerdown', () => {
  if (music.paused && !music.dataset.userPaused) startMusic();
}, { once: true });

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const target = new Date('2026-11-24T20:40:00+05:30');
function updateCountdown() {
  let diff = Math.max(0, target - new Date());
  const values = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];
  document.querySelectorAll('#countdown strong').forEach((el, i) => { el.textContent = String(values[i]).padStart(2, '0'); });
  document.querySelectorAll('.floating-time strong').forEach((el, i) => { el.textContent = String(values[i]).padStart(2, '0'); });
}
updateCountdown(); setInterval(updateCountdown, 1000);

const track = document.querySelector('.gallery-track');
document.querySelector('.gallery-next').addEventListener('click', () => track.scrollBy({left: track.clientWidth, behavior:'smooth'}));
document.querySelector('.gallery-prev').addEventListener('click', () => track.scrollBy({left: -track.clientWidth, behavior:'smooth'}));

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => {
    const petal = document.createElement('i');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.setProperty('--drift', (Math.random() * 180 - 90) + 'px');
    petal.style.animationDuration = (7 + Math.random() * 6) + 's';
    petal.style.transform = `rotate(${Math.random()*360}deg)`;
    document.querySelector('.petals').appendChild(petal);
    setTimeout(() => petal.remove(), 14000);
  }, 900);
}

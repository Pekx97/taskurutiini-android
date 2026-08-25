// ==========================================
// 1. TALLENNUS- JA TILA-APURIT (LOCALSTORAGE)
// ==========================================
const STORAGE_KEYS = {
  SCORE: 'taskurutiini_score',
  STREAK: 'taskurutiini_streak',
  LAST_LOGIN: 'taskurutiini_last_login',
  MISSION_DONE: 'taskurutiini_mission_done'
};

function getStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data !== null ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error('Virhe ladattaessa:', e);
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Virhe tallennettaessa:', e);
  }
}

// Sovelluksen sisäinen tila
let appState = {
  score: getStorage(STORAGE_KEYS.SCORE, 0),
  streak: getStorage(STORAGE_KEYS.STREAK, 0),
  lastLogin: getStorage(STORAGE_KEYS.LAST_LOGIN, null),
  missionDone: getStorage(STORAGE_KEYS.MISSION_DONE, false)
};

// ==========================================
// 2. KÄYTTÖLIITTYMÄN PÄIVITYS
// ==========================================
function updateUI() {
  const scoreEl = document.getElementById('score');
  const streakEl = document.getElementById('streakCount');
  const dateEl = document.getElementById('todayDate');

  if (scoreEl) scoreEl.textContent = appState.score;
  if (streakEl) streakEl.textContent = `🔥 ${appState.streak}`;

  if (dateEl) {
    const options = { weekday: 'short', day: 'numeric', month: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('fi-FI', options);
  }
}

// ==========================================
// 3. AAMU- JA ILTATILAN AUTOMATIIKKA
// ==========================================
function setupDayMode() {
  const currentHour = new Date().getHours();
  const modeIntro = document.getElementById('dayModeIntro');
  const modePlan = document.getElementById('dayModePlan');

  const isMorning = currentHour >= 5 && currentHour < 14;

  if (modeIntro && modePlan) {
    if (isMorning) {
      modeIntro.textContent = 'Aamutila aktiivinen: Keskity päivän käynnistämiseen rauhassa.';
      modePlan.innerHTML = '<strong>🌅 Aamun rutiini:</strong> Juo lasi vettä, tarkista päivän tärkein tehtävä ja ota rauhallinen startti.';
    } else {
      modeIntro.textContent = 'Iltatila aktiivinen: Aika rauhoittua ja käydä päivä läpi.';
      modePlan.innerHTML = '<strong>🌙 Illan rutiini:</strong> Kirjaa päivän onnistumiset, siisti työpiste ja valmistaudu uneen.';
    }
  }
}

// ==========================================
// 4. PÄIVITTÄINEN PUTKI (STREAK) JA MISSIO
// ==========================================
function checkDailyStreak() {
  const today = new Date().toDateString();
  const lastLogin = appState.lastLogin;

  if (lastLogin !== today) {
    // Jos kirjaudutaan uutena päivänä
    appState.streak += 1;
    appState.missionDone = false; // Nollataan päivän missio
    appState.lastLogin = today;

    setStorage(STORAGE_KEYS.STREAK, appState.streak);
    setStorage(STORAGE_KEYS.LAST_LOGIN, appState.lastLogin);
    setStorage(STORAGE_KEYS.MISSION_DONE, appState.missionDone);
  }
}

function initMissionButton() {
  const missionBtn = document.getElementById('completeDailyMission');
  if (!missionBtn) return;

  if (appState.missionDone) {
    missionBtn.disabled = true;
    missionBtn.textContent = 'Päivän missio suoritettu! ✨';
  } else {
    missionBtn.addEventListener('click', () => {
      appState.score += 25;
      appState.missionDone = true;

      setStorage(STORAGE_KEYS.SCORE, appState.score);
      setStorage(STORAGE_KEYS.MISSION_DONE, true);

      updateUI();
      missionBtn.disabled = true;
      missionBtn.textContent = 'Missio suoritettu! (+25p) ✨';
    });
  }
}

// ==========================================
// 5. VÄLILEHTINAVIGAATIO & SW
// ==========================================
function initNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const screens = document.querySelectorAll('.screen');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');

      navLinks.forEach(l => l.classList.remove('active'));
      screens.forEach(s => s.classList.remove('active'));

      link.classList.add('active');
      const targetScreen = document.getElementById(targetId);
      if (targetScreen) {
        targetScreen.classList.add('active');
      }
    });
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('SW rekisteröinti epäonnistui:', err);
    });
  }
}

// ==========================================
// SOVELLUKSEN KÄYNNISTYS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  checkDailyStreak();
  updateUI();
  setupDayMode();
  initMissionButton();
  initNavigation();
  registerServiceWorker();
});
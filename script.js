// script.js (ES module)
const STORAGE_KEY = 'ev_kurasi_submissions_v1';
// Çekiliş hedef tarihi: 12 Mart 2027 14:00
const COUNTDOWN_TARGET = new Date(2027, 2, 12, 14, 0, 0);
// Başvuruların son tarihi: 01 Ocak 2027 23:59:59
const APPLICATION_DEADLINE = new Date(2027, 0, 1, 23, 59, 59);

// Util functions
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function showToast(msg, time = 3000) {
  const t = qs('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), time);
}

function loadSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) { return []; }
}
function saveSubmissions(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

function genParticipationNumber() {
  const year = new Date().getFullYear();
  const base = Math.floor(100000 + Math.random() * 900000);
  const code = `EK-${year}-${base}`;
  const existing = loadSubmissions().some(s => s.participationNumber === code);
  return existing ? genParticipationNumber() : code;
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('tr-TR');
}
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('tr-TR');
}

// Init info fields
(function initInfo() {
  const infoDateEl = qs('#info-date');
  const infoTimeEl = qs('#info-time');
  const deadlineEl = qs('#info-deadline');
  if (infoDateEl) infoDateEl.textContent = '12 Mart 2027';
  if (infoTimeEl) infoTimeEl.textContent = '14:00';
  if (deadlineEl) deadlineEl.textContent = '01 Ocak 2027';
  // update apply status based on deadline
  const statusEl = qs('#apply-status');
  if (statusEl) statusEl.textContent = (Date.now() > APPLICATION_DEADLINE.getTime()) ? 'Kapalı' : 'Açık';
})();

// Countdown
function updateCountdown() {
  const now = new Date();
  const diff = COUNTDOWN_TARGET - now;
  if (diff <= 0) {
    qs('#countdown').innerHTML = '<div class="started">Çekiliş Başladı</div>';
    return;
  }
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff/(1000*60*60))%24);
  const mins = Math.floor((diff/(1000*60))%60);
  const secs = Math.floor((diff/1000)%60);
  qs('#cd-days').textContent = String(days).padStart(2,'0');
  qs('#cd-hours').textContent = String(hours).padStart(2,'0');
  qs('#cd-mins').textContent = String(mins).padStart(2,'0');
  qs('#cd-secs').textContent = String(secs).padStart(2,'0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Apply form handling
const applyForm = qs('#applyForm');
applyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // check deadline
  if (Date.now() > APPLICATION_DEADLINE.getTime()) {
    showToast('Başvurular kapandı.');
    qs('#apply-status').textContent = 'Kapalı';
    return;
  }

  const form = new FormData(applyForm);
  // basic validation
  if (!form.get('kvkk') || !form.get('terms')) {
    showToast('KVKK ve şartları kabul etmelisiniz.');
    return;
  }
  const submission = {
    id: Date.now().toString(36),
    name: (form.get('name')||'').trim(),
    surname: (form.get('surname')||'').trim(),
    tc: (form.get('tc')||'').trim(),
    phone: (form.get('phone')||'').trim(),
    email: (form.get('email')||'').trim(),
    dob: form.get('dob') || '',
    city: form.get('city')||'',
    district: form.get('district')||'',
    address: form.get('address')||'',
    kvkk: !!form.get('kvkk'),
    terms: !!form.get('terms'),
    timestamp: Date.now(),
    participationNumber: genParticipationNumber(),
    status: 'Beklemede'
  };
  const list = loadSubmissions();
  list.push(submission);
  saveSubmissions(list);
  renderStats();
  showConfirmation(submission);
  applyForm.reset();
  showToast('Başvurunuz alındı.');
});

// Confirmation modal
function showConfirmation(sub) {
  qs('#confirmationModal').setAttribute('aria-hidden','false');
  qs('#conf-name').textContent = `${sub.name} ${sub.surname}`;
  qs('#conf-date').textContent = formatDate(sub.timestamp);
  qs('#conf-time').textContent = formatTime(sub.timestamp);
  qs('#conf-code').textContent = sub.participationNumber;
  qs('#conf-status').textContent = sub.status;
  // QR (kullanıcı verisini basitçe kodla)
  const qdata = encodeURIComponent(`Katılım:${sub.participationNumber}|Ad:${sub.name} ${sub.surname}`);
  qs('#conf-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qdata}`;
  qs('#conf-qr').alt = `QR kod for ${sub.participationNumber}`;
}

qs('#closeBtn').addEventListener('click', () => qs('#confirmationModal').setAttribute('aria-hidden','true'));
qs('#closeConfirm').addEventListener('click', () => qs('#confirmationModal').setAttribute('aria-hidden','true'));
qs('#printBtn').addEventListener('click', () => window.print());
qs('#pdfBtn').addEventListener('click', async () => {
  // basit yaklaşım: print -> save as PDF
  window.print();
});

// Query
qs('#queryBtn').addEventListener('click', () => {
  const q = qs('#queryInput').value.trim();
  const list = loadSubmissions();
  const found = list.find(s => s.participationNumber.toLowerCase() === q.toLowerCase());
  const out = qs('#queryResult');
  if (!found) {
    out.textContent = 'Kayıt bulunamadı.';
    return;
  }
  out.innerHTML = `<strong>${found.participationNumber}</strong> — ${found.name} ${found.surname} — Durum: ${found.status}`;
});

// Render participant count
function renderStats() {
  const list = loadSubmissions();
  qs('#total-participants').textContent = list.length;
}
renderStats();

// Apply Now scroll
qs('#applyNow').addEventListener('click', () => {
  qs('#apply').scrollIntoView({behavior:'smooth'});
});

// Theme toggle
const themeToggle = qs('#themeToggle');
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

// Mobile menu
const menuToggle = qs('#menuToggle');
menuToggle.addEventListener('click', () => {
  const nav = qs('.nav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

// Admin helper: allow admin.html to access submissions via localStorage
export { loadSubmissions, saveSubmissions, formatDate, formatTime, genParticipationNumber, showToast };

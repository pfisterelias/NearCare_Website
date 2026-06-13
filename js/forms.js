/* ============================================================
   FORMS – EmailJS-Konfiguration & sichere Formular-Logik
   ============================================================ */

const EMAILJS_PUBLIC_KEY    = '0AbG1BR3yD0buuHum';
const EMAILJS_SERVICE_ID    = 'service_6sgu2so';
const EMAILJS_CODE_TEMPLATE = 'template_1iodh3m';
const EMAILJS_REG_TEMPLATE  = 'template_mq0yhqj';

emailjs.init(EMAILJS_PUBLIC_KEY);

/* ── Sicherheits-Hilfsfunktionen ── */

// Kryptografisch sichere 6-stellige Zufallszahl (ersetzt Math.random)
function generateCode() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(100000 + (arr[0] % 900000));
}

// Eingaben bereinigen – verhindert XSS bei EmailJS-Payload
function sanitize(str) {
  return String(str).trim().replace(/[<>&"'`]/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;',
    '"': '&quot;', "'": '&#x27;', '`': '&#x60;'
  }[c]));
}

// E-Mail-Validierung
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Telefon-Validierung (österreichisches/europäisches Format)
function isValidPhone(phone) {
  return /^[\+\d\s\-\(\)]{7,20}$/.test(phone);
}

// Rate-Limiting: mindestens 60 Sekunden zwischen Code-Versendungen
const SEND_COOLDOWN_MS = 60_000;
const MAX_CODE_ATTEMPTS = 5;

function isRateLimited() {
  const last = parseInt(sessionStorage.getItem('nearcare_last_send') || '0');
  return Date.now() - last < SEND_COOLDOWN_MS;
}

function markSent() {
  sessionStorage.setItem('nearcare_last_send', Date.now().toString());
  sessionStorage.removeItem('nearcare_attempts');
}

function getAttempts() {
  return parseInt(sessionStorage.getItem('nearcare_attempts') || '0');
}

function incrementAttempts() {
  sessionStorage.setItem('nearcare_attempts', String(getAttempts() + 1));
}

/* ── Helfer-Formular ── */

function helferSetBtn(btn, text, color) {
  btn.textContent = text;
  btn.style.background = color || '';
  btn.disabled = !!color;
}

// Schritt 1 → 2: Verifizierungscode per E-Mail senden
async function helferSendCode(resend = false) {
  // Honeypot-Check: Bots füllen dieses Feld, echte Nutzer nicht
  if (document.getElementById('h-honeypot').value) return;

  // Rate-Limiting prüfen – Feedback je nach aktivem Schritt
  if (isRateLimited()) {
    if (resend) {
      const span = document.getElementById('helfer-resend');
      const orig = span.textContent;
      span.textContent = 'Bitte noch warten...';
      setTimeout(() => { span.textContent = orig; }, 2500);
    } else {
      const btn = document.getElementById('helfer-send-code-btn');
      helferSetBtn(btn, 'Bitte kurz warten...', '#888');
      setTimeout(() => helferSetBtn(btn, 'Jetzt bewerben →'), 2500);
    }
    return;
  }

  const btn = document.getElementById('helfer-send-code-btn');

  const vorname  = sanitize(document.getElementById('h-vorname').value);
  const nachname = sanitize(document.getElementById('h-nachname').value);
  const email    = document.getElementById('h-email').value.trim();
  const telefon  = document.getElementById('h-telefon').value.trim();
  const status   = document.getElementById('h-status').value;
  const wohnort  = sanitize(document.getElementById('h-wohnort').value);

  if (!resend) {
    if (!vorname || !nachname || !email || !telefon || !status || !wohnort) {
      helferSetBtn(btn, 'Bitte alle Felder ausfüllen', '#E74C3C');
      setTimeout(() => helferSetBtn(btn, 'Jetzt bewerben →'), 2000);
      return;
    }

    if (!isValidEmail(email)) {
      helferSetBtn(btn, 'Bitte gültige E-Mail eingeben', '#E74C3C');
      setTimeout(() => helferSetBtn(btn, 'Jetzt bewerben →'), 2000);
      return;
    }

    if (!isValidPhone(telefon)) {
      helferSetBtn(btn, 'Bitte gültige Telefonnummer eingeben', '#E74C3C');
      setTimeout(() => helferSetBtn(btn, 'Jetzt bewerben →'), 2000);
      return;
    }
  }

  const code = generateCode();
  sessionStorage.setItem('nearcare_code', code);
  sessionStorage.setItem('nearcare_code_exp', Date.now() + 10 * 60 * 1000);
  sessionStorage.setItem('nearcare_data', JSON.stringify({
    vorname, nachname, email,
    telefon: sanitize(telefon), status, wohnort
  }));

  if (!resend) helferSetBtn(btn, 'Sende Code...', '#888');
  markSent();

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CODE_TEMPLATE, {
      to_email: email,
      to_name:  vorname,
      passcode: code
    });

    document.getElementById('helfer-step1').classList.add('hidden');
    document.getElementById('helfer-step2').classList.remove('hidden');
    document.getElementById('helfer-code-hint').textContent =
      `Wir haben einen 6-stelligen Code an ${email} geschickt. Bitte gib ihn hier ein um deine Adresse zu bestätigen.`;
  } catch (e) {
    helferSetBtn(btn, 'Fehler – nochmal versuchen', '#E74C3C');
    setTimeout(() => helferSetBtn(btn, 'Jetzt bewerben →'), 3000);
  }
}

// Schritt 2 → 3: Code prüfen & Bewerbung abschicken
async function helferVerifyCode() {
  const entered   = document.getElementById('h-code').value.trim();
  const saved     = sessionStorage.getItem('nearcare_code');
  const exp       = parseInt(sessionStorage.getItem('nearcare_code_exp') || '0');
  const btn       = document.getElementById('helfer-verify-btn');
  const attempts  = getAttempts();

  // Zu viele Fehlversuche → gesperrt bis neuer Code
  if (attempts >= MAX_CODE_ATTEMPTS) {
    btn.textContent = 'Zu viele Versuche – bitte neuen Code anfordern';
    btn.style.background = '#E74C3C';
    btn.disabled = true;
    return;
  }

  if (Date.now() > exp) {
    btn.textContent = 'Code abgelaufen – bitte neu anfordern';
    btn.style.background = '#E74C3C';
    setTimeout(() => { btn.textContent = 'Bestätigen →'; btn.style.background = ''; }, 3000);
    return;
  }

  if (entered !== saved) {
    incrementAttempts();
    const remaining = MAX_CODE_ATTEMPTS - getAttempts();
    if (remaining <= 0) {
      btn.textContent = 'Zu viele Versuche – bitte neuen Code anfordern';
      btn.style.background = '#E74C3C';
      btn.disabled = true;
    } else {
      btn.textContent = `Falscher Code – noch ${remaining} Versuch${remaining === 1 ? '' : 'e'}`;
      btn.style.background = '#E74C3C';
      setTimeout(() => { btn.textContent = 'Bestätigen →'; btn.style.background = ''; }, 2500);
    }
    return;
  }

  helferSetBtn(btn, 'Wird gesendet...', '#888');
  const d = JSON.parse(sessionStorage.getItem('nearcare_data') || '{}');

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_REG_TEMPLATE, {
      vorname:  d.vorname,
      nachname: d.nachname,
      email:    d.email,
      telefon:  d.telefon,
      status:   d.status,
      wohnort:  d.wohnort
    });

    sessionStorage.removeItem('nearcare_code');
    sessionStorage.removeItem('nearcare_code_exp');
    sessionStorage.removeItem('nearcare_data');

    document.getElementById('helfer-step2').classList.add('hidden');
    document.getElementById('helfer-step3').classList.remove('hidden');
  } catch (e) {
    helferSetBtn(btn, 'Fehler – nochmal versuchen', '#E74C3C');
    setTimeout(() => helferSetBtn(btn, 'Bestätigen →'), 3000);
  }
}

/* ── Heim-Formular (Formspree AJAX) ── */
document.getElementById('heim-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn    = document.getElementById('heim-submit-btn');
  const inputs = this.querySelectorAll('input:not(.form-honeypot), select');
  let filled   = true;
  inputs.forEach(i => { if (!i.value.trim()) filled = false; });

  if (!filled) {
    btn.textContent = 'Bitte alle Felder ausfüllen';
    btn.style.background = '#E74C3C';
    setTimeout(() => { btn.textContent = 'Kostenlos anmelden →'; btn.style.background = ''; }, 2000);
    return;
  }

  btn.textContent = 'Wird gesendet...';
  btn.style.background = '#888';
  btn.disabled = true;

  try {
    const res = await fetch(this.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(this)
    });

    if (!res.ok) throw new Error('Formspree error');

    document.getElementById('heim-step1').classList.add('hidden');
    document.getElementById('heim-step2').classList.remove('hidden');
  } catch {
    btn.textContent = 'Fehler – nochmal versuchen';
    btn.style.background = '#E74C3C';
    btn.disabled = false;
    setTimeout(() => { btn.textContent = 'Kostenlos anmelden →'; btn.style.background = ''; }, 3000);
  }
});

/* ── Event-Listener (ersetzen alle onclick-Attribute im HTML) ── */
document.getElementById('helfer-send-code-btn').addEventListener('click', () => helferSendCode());
document.getElementById('helfer-verify-btn').addEventListener('click', () => helferVerifyCode());
document.getElementById('helfer-resend').addEventListener('click', () => helferSendCode(true));

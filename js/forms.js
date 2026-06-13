/* ============================================================
   FORMS – EmailJS-Konfiguration & Formular-Logik
   ============================================================ */

const EMAILJS_PUBLIC_KEY    = '0AbG1BR3yD0buuHum';
const EMAILJS_SERVICE_ID    = 'service_6sgu2so';
const EMAILJS_CODE_TEMPLATE = 'template_1iodh3m';
const EMAILJS_REG_TEMPLATE  = 'template_mq0yhqj';

emailjs.init(EMAILJS_PUBLIC_KEY);

// Hilfsfunktion: Button-Status setzen
function helferSetBtn(btn, text, color) {
  btn.textContent = text;
  btn.style.background = color || '';
  btn.disabled = !!color;
}

// Schritt 1 → 2: Verifizierungscode per E-Mail senden
async function helferSendCode(resend = false) {
  const vorname  = document.getElementById('h-vorname').value.trim();
  const nachname = document.getElementById('h-nachname').value.trim();
  const email    = document.getElementById('h-email').value.trim();
  const telefon  = document.getElementById('h-telefon').value.trim();
  const status   = document.getElementById('h-status').value;
  const wohnort  = document.getElementById('h-wohnort').value.trim();
  const btn      = document.getElementById('helfer-send-code-btn');

  if (!resend && (!vorname || !nachname || !email || !telefon || !status || !wohnort)) {
    helferSetBtn(btn, 'Bitte alle Felder ausfüllen', '#E74C3C');
    setTimeout(() => helferSetBtn(btn, 'Jetzt bewerben →'), 2000);
    return;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  sessionStorage.setItem('nearcare_code', code);
  sessionStorage.setItem('nearcare_code_exp', Date.now() + 10 * 60 * 1000);
  sessionStorage.setItem('nearcare_data', JSON.stringify({ vorname, nachname, email, telefon, status, wohnort }));

  if (!resend) helferSetBtn(btn, 'Sende Code...', '#888');

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CODE_TEMPLATE, {
      to_email: email,
      to_name:  vorname,
      passcode: code
    });

    document.getElementById('helfer-step1').style.display = 'none';
    document.getElementById('helfer-step2').style.display = 'block';
    document.getElementById('helfer-code-hint').textContent =
      `Wir haben einen 6-stelligen Code an ${email} geschickt. Bitte gib ihn hier ein um deine Adresse zu bestätigen.`;
  } catch (e) {
    helferSetBtn(btn, 'Fehler – nochmal versuchen', '#E74C3C');
    setTimeout(() => helferSetBtn(btn, 'Jetzt bewerben →'), 3000);
  }
}

// Schritt 2 → 3: Code prüfen & Bewerbung abschicken
async function helferVerifyCode() {
  const entered = document.getElementById('h-code').value.trim();
  const saved   = sessionStorage.getItem('nearcare_code');
  const exp     = parseInt(sessionStorage.getItem('nearcare_code_exp') || '0');
  const btn     = document.getElementById('helfer-verify-btn');

  if (Date.now() > exp) {
    btn.textContent = 'Code abgelaufen – bitte neu anfordern';
    btn.style.background = '#E74C3C';
    setTimeout(() => { btn.textContent = 'Bestätigen →'; btn.style.background = ''; }, 3000);
    return;
  }

  if (entered !== saved) {
    btn.textContent = 'Falscher Code – nochmal versuchen';
    btn.style.background = '#E74C3C';
    setTimeout(() => { btn.textContent = 'Bestätigen →'; btn.style.background = ''; }, 2500);
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

    document.getElementById('helfer-step2').style.display = 'none';
    document.getElementById('helfer-step3').style.display = 'block';
  } catch (e) {
    helferSetBtn(btn, 'Fehler – nochmal versuchen', '#E74C3C');
    setTimeout(() => helferSetBtn(btn, 'Bestätigen →'), 3000);
  }
}

// Heim-Formular: Validierung vor Formspree-Submit
document.querySelector('.form-card.heim form').addEventListener('submit', function(e) {
  const btn    = this.querySelector('.btn-form');
  const inputs = this.querySelectorAll('input, select');
  let filled   = true;
  inputs.forEach(i => { if (!i.value.trim()) filled = false; });

  if (!filled) {
    e.preventDefault();
    btn.textContent = 'Bitte alle Felder ausfüllen';
    btn.style.background = '#E74C3C';
    setTimeout(() => { btn.textContent = 'Kostenlos anmelden →'; btn.style.background = ''; }, 2000);
  }
});

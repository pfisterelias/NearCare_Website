# NearCare Website – Entwicklertagebuch

Chronologisches Protokoll aller Sessions. Neue Einträge oben.

---

## 2026-06-13 – FAQ, UX-Verbesserungen & Dokumentationsaufteilung (Session 3)

**Entwickler:** Nathan Pfister (hofschmied)

### Was wurde gemacht?

**1. UX-Verbesserungen Helfer-Formular** (`fix/ux-bugs`)

- **Countdown-Timer**: Zeigt im Schritt 2 die verbleibende Gültigkeitsdauer des Codes an (`Code gültig noch MM:SS`). Bei Ablauf wechselt die Anzeige auf rot (`code-timer--expired`). Timer wird beim Zurückgehen gestoppt.
- **„E-Mail ändern"-Schaltfläche**: Link `← E-Mail ändern` im Schritt 2 führt zurück zu Schritt 1 ohne Seitenreload. Code-Input und Button-Zustand werden zurückgesetzt.

**2. DSGVO-Konformität** (`fix/legal-perf`)

- **Altersbestätigung (16+)**: Pflichtcheckbox vor dem Absenden der Helfer-Bewerbung. Verknüpft mit AGB- und Datenschutz-Modal. Entspricht der AGB-Anforderung (§3.1: Mindestalter 16 Jahre). Wird im Frontend geprüft, bevor der Code per E-Mail versendet wird.
- **Preconnect-Links**: `<link rel="preconnect">` für `fonts.googleapis.com` und `fonts.gstatic.com` – beschleunigt Font-Ladezeit.
- **Theme-Color**: `<meta name="theme-color" content="#0D1F2D">` für Mobile-Browser-UI.

**3. FAQ-Sektion** (`feat/faq`)

Neue Section `#faq` zwischen Pricing und Registrierung:
- 10 Fragen in 2 Spalten (5× Altersheime, 5× Helfer)
- Technologie: natives `<details>/<summary>` HTML – kein JavaScript erforderlich
- `+`-Icon dreht sich per CSS zu `×` wenn geöffnet (`transform: rotate(45deg)`)
- Nav-Link `FAQ` ergänzt, Mobile-Breakpoint gesetzt (1 Spalte, `grid-template-columns: 1fr`)

**4. Dokumentationsaufteilung**

- `CLAUDE.md` bleibt technische Referenz (Designsystem, Dateistruktur, häufige Änderungen)
- `CHANGELOG.md` (diese Datei) übernimmt das Entwicklertagebuch – wächst pro Session

### Git-Commits dieser Session

```
7bd54ef  feat: FAQ-Sektion mit details/summary Accordion
(merge)  merge: FAQ-Sektion in main übernommen
(aktuell) docs: CLAUDE.md aufgeteilt – CHANGELOG.md neu erstellt
```

### Offene Punkte / Hinweise

- **SessionStorage-Code**: 6-stelliger Verifikationscode liegt client-seitig (sessionStorage). CSP schützt gut dagegen, aber ein serverseitiger Ansatz via Cloudflare Workers wäre die sauberere Lösung für maximale Sicherheit.
- **Plausible Analytics**: Datenschutzfreundliche Besucherstatistiken ohne Cookies – noch nicht implementiert.
- **Testimonials**: Kurze Zitate von Einrichtungen/Helfern als social proof – noch nicht implementiert.

---

## 2026-06-13 – Bugfixes, Sicherheit & Code-Qualität (Session 2)

**Entwickler:** Nathan Pfister (hofschmied)

### Was wurde gemacht?

**1. Bugfixes** (`fix/quick-wins`, `feat/heim-form-ajax`)

- **OG-Image-URL**: Zeigte auf `pfisterelias.github.io/...` statt `https://nearcare.at/og-preview.png`. Fix: korrekte Domain eingetragen.
- **Heim-Formular Redirect**: Native Formular-Submission leitete auf Formspree-Seite um. Fix: Umstellung auf `fetch()` AJAX-POST mit `Accept: application/json`-Header. Erfolgsbestätigung (Step 2) implementiert – Nutzer verlassen nearcare.at nicht mehr.

**2. Sicherheitshärtung** (`fix/quick-wins`)

- **Subresource Integrity (SRI)**: EmailJS-CDN auf Version `4.4.1` gepinnt, SHA-384-Hash hinterlegt (`integrity="sha384-..."`, `crossorigin="anonymous"`). Verhindert Code-Ausführung bei CDN-Kompromittierung.
- **CSP `style-src` ohne `unsafe-inline`**: Durch vollständige Entfernung aller `style=""` HTML-Attribute konnte `'unsafe-inline'` aus dem `style-src`-Directive entfernt werden.
- **CSP `connect-src`**: `https://formspree.io` ergänzt (für AJAX-POST benötigt).

**3. Inline-Styles → CSS-Klassen** (`refactor/remove-inline-styles`)

Über 30 `style=""`-Attribute aus dem HTML entfernt. Neue CSS-Klassen:

| Klasse | Zweck |
|---|---|
| `.hidden` | Utility: `display: none !important` (in `css/base.css`) |
| `.nav-logo-link` | Nav-Logo-Link Styling |
| `.modal-backdrop` | Modal-Hintergrund (position:fixed, overlay) |
| `.modal-box` / `.modal-box--narrow` | Modal-Inhaltsbox |
| `.modal-close` | Close-Button Positionierung |
| `.modal-title`, `.modal-meta`, `.modal-body` | Modal-Inhalt-Typografie |
| `.form-success`, `.form-success-icon` | Erfolgs-Screen |
| `.input-otp` | Code-Input (Schrift, Spacing, Zentrierung) |
| `.code-hint`, `.resend-row`, `.resend-link` | Code-Eingabe UI |
| `.code-timer`, `.code-timer--expired` | Countdown-Timer |
| `.form-check`, `.checkbox-label` | Checkbox + Label Layout |

JavaScript (`ui.js`, `forms.js`): Alle `element.style.display = '...'` auf `classList.add/remove('hidden')` umgestellt.

**4. Accessibility & UX** (`fix/accessibility`)

- Alle `<label>`-Elemente mit `for="input-id"` verknüpft (Screen-Reader)
- `autocomplete`-Attribute auf allen Inputs
- `inputmode="tel"` auf Telefon-Inputs (mobile Zahlen-Tastatur)
- `autocomplete="one-time-code"` + `inputmode="numeric"` auf Code-Input (iOS/Android OTP-Autofill)
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` auf allen 3 Modals
- `aria-label="Schließen"` auf Modal-Close-Buttons
- Escape-Taste schließt offene Modals
- Klick außerhalb des Burger-Menüs schließt Nav
- `@media (prefers-reduced-motion: reduce)` – Animationen deaktiviert für Nutzer die das bevorzugen

### Git-Commits dieser Session

```
ac73ad1  fix: OG-Image-URL auf nearcare.at korrigiert & SRI für EmailJS CDN
dcb9fd3  feat: Heim-Formular auf Formspree AJAX umgestellt
4dad3df  refactor: Alle Inline-Styles in CSS-Klassen extrahiert
1e067c4  fix: Accessibility – Labels, autocomplete & inputmode
```

### Offene Punkte

- **EmailJS Allowed Origins**: Im EmailJS-Dashboard manuell auf `https://nearcare.at` setzen (Dashboard → Account → Security → Allowed Origins).

---

## 2026-06-13 – Vollständiges Refactoring & Sicherheitshärtung (Session 1)

**Entwickler:** Nathan Pfister

**Ausgangslage:** Die gesamte Website war in einer einzigen `index.html` (1782 Zeilen) – CSS inline, JavaScript inline, alle Event-Handler als `onclick`-Attribute.

### Was wurde gemacht?

**1. CSS-Schichtenmodell eingeführt** (`refactor/project-structure`)

Die ~600 Zeilen Inline-CSS wurden in 5 separate Dateien aufgeteilt:

| Datei | Inhalt |
|---|---|
| `css/base.css` | CSS-Variablen, Reset, Typografie, Animationen (`fadeUp`, `fadeIn`) |
| `css/layout.css` | Navigation, Footer, Abschnittsbasis |
| `css/components.css` | Buttons, Badges, Karten, Tabs, Formulare |
| `css/sections.css` | Hero, Quote, Helfer, Pricing, CTA, FAQ, Register |
| `css/responsive.css` | Alle Mobile-Breakpoints (`max-width: 768px`) |

Bestehender Bug behoben: `.helfer-grid`-Selector im Responsive-CSS verwendete den fragilen `[style*="grid-template-columns"]`-Hack; ersetzt durch saubere Klasse.

**2. JavaScript modularisiert** (`refactor/project-structure`)

| Datei | Inhalt |
|---|---|
| `js/ui.js` | Touch-Feedback, Burger-Nav, Tab-Umschaltung, Modals, Scroll-Reveal |
| `js/forms.js` | Helfer-Registrierungslogik, EmailJS-Integration, Heim-Formular |

**3. Sicherheitshärtung** (`feature/security-hardening`)

Alle 10+ `onclick`-Attribute entfernt. Event-Delegation via `data-tab`, `data-opens`, `.modal-close`.

- **CSP-Header** via `<meta>`: Strikte `script-src`, kein `unsafe-inline` für Scripts
- **`crypto.getRandomValues()`** statt `Math.random()` für Verifikationscodes
- **`sanitize()`-Funktion**: HTML-Entity-Escaping vor EmailJS-Versand
- **E-Mail & Telefon-Validierung** via Regex
- **Rate-Limiting**: 60s Cooldown zwischen Code-Versendungen (sessionStorage)
- **Honeypot-Felder** in beiden Formularen
- **`required` + `maxlength`** auf allen Formularfeldern
- **sessionStorage wird nach Verifikation vollständig geleert**

**4. Bugfixes** (`fix/bruteforce-protection`)

- **Brute-Force-Schutz**: `helferVerifyCode()` hatte kein Versuchslimit. Fix: Max. 5 Versuche (`MAX_CODE_ATTEMPTS`).
- **Rate-Limiting-Feedback Schritt 2**: Feedback wurde auf dem in Schritt 2 unsichtbaren Button angezeigt. Fix: Separater Feedback-Pfad für `#helfer-resend`-Span.

### Git-Commits dieser Session

```
59b07d2  refactor: Monolithische index.html in Schichten aufgeteilt
a34b44e  feat(security): Sicherheitshärtung & Entwicklerdokumentation
d8cece3  merge: Projektstruktur-Refactoring in main übernommen
08df445  merge: Sicherheitshärtung in main übernommen
e5164ed  fix: Brute-Force-Schutz und Rate-Limiting-Feedback korrigiert
a0efb79  merge: Brute-Force-Schutz in main übernommen
```

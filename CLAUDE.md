# NearCare Website – Entwicklerdokumentation

## Projektübersicht

NearCare ist eine statische Marketing-Website für eine Vermittlungsplattform, die Schüler und
Studenten mit Altersheimen und Privatpersonen in Vorarlberg verbindet. Hosting: **GitHub Pages**
unter der Domain **nearcare.at**.

## Technologiestack

| Schicht       | Technologie                          |
|---------------|--------------------------------------|
| Markup        | HTML5                                |
| Styling       | CSS3 (keine Frameworks)              |
| Interaktion   | Vanilla JavaScript (ES2020+)         |
| E-Mail        | EmailJS SDK v4 (CDN)                 |
| Formulare     | Formspree (Einrichtungsregistrierung)|
| Hosting       | GitHub Pages                         |
| Schriften     | Google Fonts (Playfair Display, DM Sans) |

## Dateistruktur

```
NearCare_Website/
├── css/
│   ├── base.css          # CSS-Variablen, Reset, Typografie, Animationen
│   ├── layout.css        # Navigation, Footer, Abschnittsbasis
│   ├── components.css    # Wiederverwendbare UI-Komponenten (Buttons, Karten, Tabs, Formulare)
│   ├── sections.css      # Seitenbereichs-spezifische Stile (Hero, Pricing, CTA usw.)
│   └── responsive.css    # Alle @media-Breakpoints (Mobile ≤ 768px)
├── js/
│   ├── ui.js             # Navigation, Tabs, Modals, Scroll-Reveal, Touch-Feedback
│   └── forms.js          # EmailJS-Konfiguration, Helfer-Formular, Heim-Formular
├── favicon.svg           # Favicon (NC-Logo, Navy/Terra auf Cream)
├── nearcare-logo.svg     # Vollständiges Wortmarken-Logo
├── og-preview.png        # Social-Sharing-Bild (1200×630px)
├── og-preview.svg        # Vektor-Version des Previews
├── CNAME                 # nearcare.at (GitHub Pages Custom Domain)
├── CLAUDE.md             # Diese Dokumentation
└── index.html            # Einzige HTML-Seite (Single-Page-Website)
```

## Designsystem

### Farben (CSS-Variablen in `css/base.css`)

```css
--navy:       #0D1F2D   /* Primärfarbe, Texte, Navigation */
--terra:      #C45E3E   /* Akzentfarbe, CTAs, Hover-Effekte */
--terra-light:#D4724F   /* Helleres Terra für Hover */
--warm:       #F0C987   /* Goldton, Preise, Akzente */
--cream:      #F8F5EF   /* Heller Hintergrund, Formulare */
--white:      #FFFFFF
--gray:       #6B7280   /* Texte, Unterüberschriften */
--border:     #E5E7EB   /* Trennlinien, Input-Rahmen */
```

### Schriften

- **Playfair Display** (serif) → Überschriften, Zahlen, Zitate
- **DM Sans** (sans-serif) → Fließtext, Buttons, Labels

## Formulare & externe Dienste

### Helfer-Registrierung (3-Schritt-Prozess)

1. **Schritt 1** – Daten eingeben (Vorname, Nachname, E-Mail, Telefon, Status, Wohnort)
2. **Schritt 2** – E-Mail-Verifikation: 6-stelliger Code via **EmailJS**
3. **Schritt 3** – Erfolgsbestätigung

EmailJS-Konfiguration in `js/forms.js`:
```js
const EMAILJS_PUBLIC_KEY    = '0AbG1BR3yD0buuHum';  // Öffentlich (OK für Frontend)
const EMAILJS_SERVICE_ID    = 'service_6sgu2so';
const EMAILJS_CODE_TEMPLATE = 'template_1iodh3m';   // Verifizierungscode
const EMAILJS_REG_TEMPLATE  = 'template_mq0yhqj';   // Bewerbungsbestätigung
```

### Einrichtungsregistrierung (Formspree)

Direktes HTML-Formular an `https://formspree.io/f/xzdyadge`.
Keine JavaScript-Integration nötig – Formspree verarbeitet die Daten.

## Sicherheitsmaßnahmen

| Maßnahme                  | Implementierung                                    |
|---------------------------|----------------------------------------------------|
| Content Security Policy   | `<meta http-equiv="CSP">` in `index.html`          |
| Kryptografischer Zufall   | `crypto.getRandomValues()` statt `Math.random()`   |
| Input-Sanitisierung       | `sanitize()` in `js/forms.js` vor EmailJS-Versand  |
| E-Mail-Validierung        | Regex-Prüfung in `js/forms.js`                     |
| Telefon-Validierung       | Regex-Prüfung in `js/forms.js`                     |
| Rate-Limiting             | 60s Cooldown (sessionStorage) für Code-Versendungen|
| Honeypot-Felder           | `.form-honeypot` in beiden Formularen              |
| HTML required + maxlength | Auf allen Formularfeldern gesetzt                  |
| Keine inline Scripts      | Alle Handler in externen JS-Dateien                |
| Externe Links             | `rel="noopener noreferrer"` auf allen target=_blank|
| HTTPS                     | Automatisch durch GitHub Pages                     |
| Keine Cookies             | Kein Tracking, keine Persistenz                    |
| sessionStorage            | Wird nach Verifikation vollständig geleert         |

## Häufige Änderungen

### Preise anpassen
In `index.html`, Abschnitt `<section class="pricing">`:
```html
<div class="price"><sup>€</sup>79</div>
```

### Statistiken im Hero ändern
In `index.html`, Abschnitt `<section class="hero">`:
```html
<div class="stat-num">47</div>
<div class="stat-label">Altersheime...</div>
```

### Neue Farbe hinzufügen
In `css/base.css`, im `:root`-Block:
```css
--neue-farbe: #HEXCODE;
```

### Mobilsicht anpassen
Alle Breakpoints in `css/responsive.css` (aktuell: `max-width: 768px`).

### EmailJS-Templates ändern
Templates werden direkt im EmailJS-Dashboard verwaltet.
Template-IDs in `js/forms.js` aktuell halten.

## Entwicklung lokal

Da es eine statische Website ist, reicht ein einfacher HTTP-Server:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Dann `http://localhost:8080` öffnen.

## Branch-Strategie

- `main` – Produktionsstand
- `refactor/*` – Strukturelle Änderungen
- `feature/*` – Neue Funktionen
- `fix/*` – Bugfixes

## Deployment

Push auf `main` → GitHub Actions deployt automatisch auf GitHub Pages → nearcare.at
(via CNAME-Datei; keine weitere Konfiguration nötig)

## Kontakt

**Elias Pfister & Luca Marinelli**
nearcare.office@gmail.com · nearcare.at · Vorarlberg, Österreich

---

## Entwicklertagebuch

### 2026-06-13 – Vollständiges Refactoring & Sicherheitshärtung

**Ausgangslage:** Die gesamte Website war in einer einzigen `index.html` (1782 Zeilen) untergebracht – CSS inline, JavaScript inline, alle Event-Handler als `onclick`-Attribute.

#### Was wurde gemacht?

**1. CSS-Schichtenmodell eingeführt** (`refactor/project-structure`)

Die ~600 Zeilen Inline-CSS wurden in 5 separate Dateien aufgeteilt:

| Datei | Inhalt |
|---|---|
| `css/base.css` | CSS-Variablen, Reset, Typografie, Animationen (`fadeUp`, `fadeIn`) |
| `css/layout.css` | Navigation, Footer, Abschnittsbasis |
| `css/components.css` | Buttons, Badges, Karten, Tabs, Formulare |
| `css/sections.css` | Hero, Quote, Helfer, Pricing, CTA, Register |
| `css/responsive.css` | Alle Mobile-Breakpoints (`max-width: 768px`) |

Dabei wurden auch bestehende Fehler behoben: Der `.helfer-grid`-Selector im Responsive-CSS verwendete den fragilen `[style*="grid-template-columns"]`-Hack; ersetzt durch eine saubere Klasse.

**2. JavaScript modularisiert** (`refactor/project-structure`)

Der Inline-Script-Block wurde in 2 Module aufgeteilt:
- `js/ui.js` – Touch-Feedback, Burger-Nav, Tab-Umschaltung, Modals, Scroll-Reveal
- `js/forms.js` – Helfer-Registrierungslogik, EmailJS-Integration, Heim-Formular

**3. Sicherheitshärtung** (`feature/security-hardening`)

Alle 10+ `onclick`-Attribute aus dem HTML entfernt. Stattdessen Event-Delegation via `data-tab`, `data-opens`, `.modal-close`.

Eingebaute Schutzmaßnahmen:
- **CSP-Header** via `<meta>`: Strikte `script-src`, kein `unsafe-inline` für Scripts
- **`crypto.getRandomValues()`** statt `Math.random()` für Verifikationscodes
- **`sanitize()`-Funktion**: HTML-Entity-Escaping vor EmailJS-Versand
- **E-Mail & Telefon-Validierung** via Regex
- **Rate-Limiting**: 60 Sekunden Cooldown zwischen Code-Versendungen (sessionStorage)
- **Honeypot-Felder** in beiden Formularen (`.form-honeypot`)
- **`required` + `maxlength`** auf allen Formularfeldern
- **sessionStorage wird nach Verifikation vollständig geleert**

**4. Bugfixes** (`fix/bruteforce-protection`)

- **Brute-Force-Schutz**: `helferVerifyCode()` hatte kein Versuchslimit – ein Angreifer hätte alle 900.000 möglichen 6-stelligen Codes im 10-Minuten-Fenster ausprobieren können. Fix: Max. 5 Versuche (`MAX_CODE_ATTEMPTS`), danach Button deaktiviert.
- **Rate-Limiting-Feedback im Schritt 2**: Bei `helferSendCode(true)` (Resend) wurde Feedback auf dem in Schritt 2 unsichtbaren `#helfer-send-code-btn` angezeigt. Fix: Separater Feedback-Pfad für den `#helfer-resend`-Span.
- **Heim-Formular**: Von Click-Handler auf `submit`-Event-Listener umgestellt, um Doppelversand zu vermeiden.

**5. Entwicklerdokumentation** (`feature/security-hardening`)

`CLAUDE.md` neu erstellt mit vollständiger Projektdokumentation: Technologiestack, Dateistruktur, Designsystem, Formulare, Sicherheitsmaßnahmen, häufige Änderungen, Branch-Strategie.

#### Git-Commits dieser Session

```
59b07d2  refactor: Monolithische index.html in Schichten aufgeteilt
a34b44e  feat(security): Sicherheitshärtung & Entwicklerdokumentation
d8cece3  merge: Projektstruktur-Refactoring in main übernommen
08df445  merge: Sicherheitshärtung in main übernommen
e5164ed  fix: Brute-Force-Schutz und Rate-Limiting-Feedback korrigiert
a0efb79  merge: Brute-Force-Schutz in main übernommen
```

#### Offene Punkte / Hinweise

- **EmailJS Allowed Origins** muss im EmailJS-Dashboard manuell auf `https://nearcare.at` gesetzt werden, um den Public Key vor Missbrauch auf fremden Domains zu schützen. (Dashboard → Account → Security → Allowed Origins)
- Der Public Key im Code ist per Design öffentlich (Frontend-SDK) – die Allowed-Origins-Einschränkung ist die einzige serverseitige Absicherung.

---

### 2026-06-13 – Bugfixes, Sicherheit & Code-Qualität (Session 2)

**Ausgangslage:** Nach dem Refactoring blieben mehrere Bugs, Sicherheitslücken und Code-Qualitätsprobleme bestehen, die in dieser Session systematisch behoben wurden.

#### Was wurde gemacht?

**1. Bugfixes** (`fix/quick-wins`, `feat/heim-form-ajax`)

- **OG-Image-URL**: Zeigte noch auf `pfisterelias.github.io/...` statt `https://nearcare.at/og-preview.png`. Beim Teilen des Links wurde das Vorschaubild nicht korrekt geladen.
- **Heim-Formular Redirect**: Native Formular-Submission leitete Nutzer auf Formspree-Seite um – kein Feedback, kein Verbleib auf nearcare.at. Fix: Umstellung auf `fetch()` AJAX-POST mit `Accept: application/json`. Erfolgsbestätigung (Step 2) analog zum Helfer-Formular implementiert.

**2. Sicherheitshärdung** (`fix/quick-wins`)

- **Subresource Integrity (SRI)**: EmailJS-CDN auf Version `4.4.1` gepinnt, SHA-384-Hash hinterlegt (`integrity="sha384-..."`, `crossorigin="anonymous"`). Verhindert Code-Ausführung bei CDN-Kompromittierung.
- **CSP `style-src` ohne `unsafe-inline`**: Durch vollständige Entfernung aller `style=""` HTML-Attribute konnte `'unsafe-inline'` aus dem `style-src` Directive entfernt werden – stärkste mögliche Einschränkung ohne Nonces/Hashes.
- **CSP `connect-src`**: `https://formspree.io` ergänzt (wird für AJAX-POST benötigt).

**3. Inline-Styles → CSS-Klassen** (`refactor/remove-inline-styles`)

Über 30 `style=""` Attribute aus dem HTML entfernt. Neue CSS-Klassen:

| Klasse | Zweck |
|---|---|
| `.hidden` | Utility: `display: none !important` |
| `.nav-logo-link` | Nav-Logo-Link Styling |
| `.modal-backdrop` | Modal-Hintergrund (position:fixed, overlay) |
| `.modal-box` / `.modal-box--narrow` | Modal-Inhaltsbox |
| `.modal-close` | Close-Button Positionierung |
| `.modal-title`, `.modal-meta`, `.modal-body` | Modal-Inhalt-Typografie |
| `.form-success`, `.form-success-icon` | Erfolgs-Screen Styling |
| `.input-otp` | Code-Input (Schrift, Spacing, Zentrierung) |
| `.code-hint`, `.resend-row`, `.resend-link` | Code-Eingabe UI |

JavaScript (`ui.js`, `forms.js`): Alle `element.style.display = '...'` auf `classList.add/remove('hidden')` umgestellt.

**4. Accessibility & UX** (`fix/accessibility`)

- Alle `<label>`-Elemente mit `for="input-id"` verknüpft (Screen-Reader-Kompatibilität)
- `autocomplete`-Attribute auf allen Inputs (`email`, `tel`, `name`, `given-name`, `family-name`, etc.)
- `inputmode="tel"` auf Telefon-Inputs (mobile Zahlen-Tastatur)
- `autocomplete="one-time-code"` + `inputmode="numeric"` auf Code-Input (iOS/Android OTP-Autofill)
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` auf allen 3 Modals
- `aria-label="Schließen"` auf Modal-Close-Buttons
- Escape-Taste schließt offene Modals (Event-Listener in `ui.js`)

#### Git-Commits dieser Session

```
ac73ad1  fix: OG-Image-URL auf nearcare.at korrigiert & SRI für EmailJS CDN
dcb9fd3  feat: Heim-Formular auf Formspree AJAX umgestellt
4dad3df  refactor: Alle Inline-Styles in CSS-Klassen extrahiert
1e067c4  fix: Accessibility – Labels, autocomplete & inputmode
```

#### Offene Punkte

- **sessionStorage-Verifikationscode**: Der 6-stellige Code liegt im sessionStorage (lesbar für alle Scripts). Mit CSP gut abgesichert, aber für maximale Sicherheit wäre ein serverseitiger Code-Versand via Cloudflare Workers die sauberere Lösung.
- **EmailJS Allowed Origins**: Manuell im EmailJS-Dashboard auf `https://nearcare.at` setzen (siehe Session 1).
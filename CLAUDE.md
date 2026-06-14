# NearCare Website – Entwicklerdokumentation

## Projektübersicht

NearCare ist eine statische Marketing-Website für eine Vermittlungsplattform, die Schüler und
Studenten mit Altersheimen und Privatpersonen in Vorarlberg verbindet. Hosting: **GitHub Pages**
unter der Domain **nearcare.at**.

Entwicklertagebuch (pro Session): siehe [`CHANGELOG.md`](CHANGELOG.md)

## Technologiestack

| Schicht       | Technologie                          |
|---------------|--------------------------------------|
| Markup        | HTML5                                |
| Styling       | CSS3 (keine Frameworks)              |
| Interaktion   | Vanilla JavaScript (ES2020+)         |
| E-Mail        | EmailJS SDK v4 (CDN, SRI-gepinnt)    |
| Formulare     | Formspree AJAX (Einrichtungsregistrierung)|
| Hosting       | GitHub Pages                         |
| Schriften     | Google Fonts (Playfair Display, DM Sans) |

## Dateistruktur

```
NearCare_Website/
├── assets/
│   ├── favicon.svg       # Favicon (NC-Logo, Navy/Terra auf Cream)
│   ├── nearcare-logo.svg # Vollständiges Wortmarken-Logo
│   ├── og-preview.png    # Social-Sharing-Bild (1200×630px)
│   └── og-preview.svg    # Vektor-Version des Previews
├── css/
│   ├── base.css          # CSS-Variablen, Reset, Typografie, Animationen, .hidden
│   ├── layout.css        # Navigation, Footer, Abschnittsbasis
│   ├── components.css    # Wiederverwendbare UI-Komponenten (Buttons, Karten, Tabs, Formulare, Modals)
│   ├── sections.css      # Seitenbereichs-spezifische Stile (Hero, Pricing, FAQ, CTA usw.)
│   └── responsive.css    # Alle @media-Breakpoints (Mobile ≤ 768px)
├── js/
│   ├── ui.js             # Navigation, Tabs, Modals, Scroll-Reveal, Touch-Feedback
│   └── forms.js          # EmailJS-Konfiguration, Helfer-Formular, Heim-Formular
├── CHANGELOG.md          # Entwicklertagebuch (pro Session, neueste zuerst)
├── CLAUDE.md             # Technische Referenzdokumentation (diese Datei)
├── CNAME                 # nearcare.at (GitHub Pages Custom Domain)
├── index.html            # Einzige HTML-Seite (Single-Page-Website)
├── robots.txt            # Crawler-Regeln & Sitemap-Pointer
└── sitemap.xml           # URL-Karte für Google
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

1. **Schritt 1** – Daten eingeben (Vorname, Nachname, E-Mail, Telefon, Status, Wohnort) + Altersbestätigung (16+)
2. **Schritt 2** – E-Mail-Verifikation: 6-stelliger Code via **EmailJS** (10 min gültig, Countdown-Anzeige)
3. **Schritt 3** – Erfolgsbestätigung

EmailJS-Konfiguration in `js/forms.js`:
```js
const EMAILJS_PUBLIC_KEY    = '0AbG1BR3yD0buuHum';  // Öffentlich (OK für Frontend)
const EMAILJS_SERVICE_ID    = 'service_6sgu2so';
const EMAILJS_CODE_TEMPLATE = 'template_1iodh3m';   // Verifizierungscode
const EMAILJS_REG_TEMPLATE  = 'template_mq0yhqj';   // Bewerbungsbestätigung
```

> **Wichtig:** Im EmailJS-Dashboard unter Account → Security → Allowed Origins den Origin
> `https://nearcare.at` eintragen, um den Public Key vor Missbrauch auf fremden Domains zu schützen.

### Einrichtungsregistrierung (Formspree AJAX)

Formular `#heim-form` posted per `fetch()` an `https://formspree.io/f/xzdyadge` mit
`Accept: application/json`-Header. Erfolgsbestätigung via `#heim-step2` (kein Redirect).

## Sicherheitsmaßnahmen

| Maßnahme                  | Implementierung                                    |
|---------------------------|----------------------------------------------------|
| Content Security Policy   | `<meta http-equiv="CSP">` – kein `unsafe-inline`   |
| Subresource Integrity     | EmailJS CDN v4.4.1 mit SHA-384-Hash gepinnt        |
| Kryptografischer Zufall   | `crypto.getRandomValues()` statt `Math.random()`   |
| Input-Sanitisierung       | `sanitize()` in `js/forms.js` vor EmailJS-Versand  |
| E-Mail-Validierung        | Regex-Prüfung in `js/forms.js`                     |
| Telefon-Validierung       | Regex-Prüfung in `js/forms.js`                     |
| Rate-Limiting             | 60s Cooldown (sessionStorage) für Code-Versendungen|
| Brute-Force-Schutz        | Max. 5 Versuche (`MAX_CODE_ATTEMPTS`) pro Code     |
| Honeypot-Felder           | `.form-honeypot` in beiden Formularen              |
| HTML required + maxlength | Auf allen Formularfeldern gesetzt                  |
| Altersverifikation        | Pflicht-Checkbox (16+) vor Helfer-Bewerbung        |
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

### FAQ-Fragen bearbeiten
In `index.html`, Abschnitt `<section class="faq">`:
```html
<details class="faq-item">
  <summary>Wie funktioniert die Vermittlung?</summary>
  <p>Antworttext hier...</p>
</details>
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

**Elias Pfister**
nearcare.office@gmail.com · nearcare.at · Vorarlberg, Österreich

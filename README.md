# Djurs-IT-Partner – statisk website

Dette repository indeholder en komplet statisk hjemmeside for Djurs-IT-Partner bygget i ren HTML, CSS og lidt JavaScript. Løsningen kan hostes på enhver statisk platform som Cloudflare Pages, Netlify eller Vercel uden build-step.

## Struktur

```
/
├─ index.html
├─ services/, business/, about/, pricing/, booking/, contact/, blog/, legal/
├─ en/ (udvalgte sider på engelsk)
├─ assets/
│  ├─ css/styles.css
│  ├─ js/main.js
│  ├─ images/logo.svg
│  └─ icons/favicon.svg
├─ partials/ (genbrugelige header/footer)
├─ sitemap.xml, robots.txt, security.txt
└─ README.md
```

## Deployment

### Cloudflare Pages
1. Opret et nyt projekt og forbind til dette repo.
2. Vælg *Direct upload* eller Git-integration. Ingen build-kommando nødvendig; angiv `.` som output mappe.
3. Aktivér "Always Online" og tilføj eventuelle sikkerhedsheeaders (se nedenfor) via Cloudflare Rules eller "Transform Rules".

### Netlify
1. Klik "New site from Git" og vælg repoet.
2. Build-kommando: tom. Publish directory: `.`
3. Tilføj `_headers` fil via Netlify-konfiguration eller UI for at implementere sikkerhedsheadere.

### Vercel
1. Importer projektet i Vercel.
2. Build-kommando: "--" (ingen). Output directory: `.`
3. Deaktivér Edge Functions. Brug "Headers" i `vercel.json` (valgfrit) til sikkerhedsheadere.

## Formularer (Formspree)
- Booking- og kontaktformularer sender til `https://formspree.io/f/mayvdjqr`.
- Opdater ID’et i HTML, når du har oprettet din egen Formspree-form.
- Aktiver honeypot og bekræft e-mailen i Formspree-dashboardet.

### Alternativ: Getform
Skift `action`-attributten til din Getform-endpoint-URL. Strukturen for inputs kan genbruges.

## Sikkerhedsheadere
Anbefalede headere (eksempel til Netlify `_headers`):

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; img-src 'self' https://fonts.gstatic.com data:; script-src 'self' https://plausible.io; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-src https://www.google.com;
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=()
```

Justér CSP hvis du aktiverer Plausible Analytics eller andre eksterne scripts.

## SEO-tjekliste
- Unikke `<title>` og `<meta name="description">` på alle sider (allerede implementeret).
- Canonical links, Open Graph og Twitter cards til deling.
- `sitemap.xml`, `robots.txt` og `security.txt` inkluderet.
- JSON-LD: LocalBusiness (forside), Service (ydelser), BlogPosting (hvert indlæg).
- Breadcrumbs med schema-markup på undersider.

## JSON-LD eksempler
- Forside (`index.html`): LocalBusiness med adresse, telefon og åbningstider.
- Services (`services/index.html`): Service-objekt med område og serviceType.
- Blogindlæg (`blog/*.html`): BlogPosting med datoer og publisher.

## Tilpasning
- Opdater kontaktinfo i partials (`partials/header*.html`, `partials/footer*.html`) og i lovpligtige sider.
- Udskift logo og favicon i `assets/images/logo.svg` og `assets/icons/favicon.svg`.
- Ændr farver/typografi i `assets/css/styles.css`.

## Udvikling
- Åbn `index.html` direkte i browseren eller brug en simpel HTTP-server (`python -m http.server`).
- JavaScript (`assets/js/main.js`) håndterer inkluderede partials, mobilnavigation, accordion, tabs og let formularvalidering.

## Yderligere noter
- Formulardata har honeypot-felt (`company`) for at reducere spam.
- Dark mode følger brugerens `prefers-color-scheme`.
- Alle billeder er lazy-loadede eller baggrundsgrafik for performance.
- Husk at tilføje Plausible-skriptet i `<head>` hvis analytics ønskes:
  ```html
  <script defer data-domain="djursitpartner.dk" src="https://plausible.io/js/script.js"></script>
  ```

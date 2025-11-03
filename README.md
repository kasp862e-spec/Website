# Din gulvmand v/Nikolaj Nyhuus – Marketingwebsite

Statisk marketingwebsite bygget i ren HTML, CSS og JavaScript til virksomheden “Din gulvmand v/Nikolaj Nyhuus”. Løsningen er klar til upload hos fx Dandomain og kræver ingen buildproces.

## Struktur
```
index.html        Forside
about.html        Om os
services.html     Ydelser
contact.html      Kontakt og formularer
assets/css/       Globalt stylesheet
assets/js/        JavaScript til navigation, cookies og formularer
assets/img/       Plads til billeder (pt. SVG-placeholdere)
robots.txt        Søgemaskineinstruktioner
sitemap.xml       XML-sitemap
```

## Kom godt i gang
1. Upload hele mappen til webhotellet (rodmappen skal indeholde HTML-filerne og `assets/`).
2. Sørg for, at eventuelle egne billeder placeres i `assets/img/` og opdater `src`-attributter efter behov.
3. Siden er mobilvenlig, SEO-optimeret og indeholder et tilgængeligt cookie-banner.

## Google Analytics (GA4)
1. Opret eller find GA4-måle-id’et (format: `G-XXXXXXXXXX`).
2. Åbn `assets/js/main.js` og erstat værdien i konstanten `GA_ID` med dit faktiske måle-id.
3. Når en bruger accepterer analytiske cookies, indlæses GA-scriptet dynamisk. Ved afvisning indlæses GA ikke.

## Cookie-håndtering
- Samtykke gemmes i `localStorage` under nøglen `dg_cookie_consent`.
- Banneret har tre handlinger: **Accepter**, **Afvis** og **Indstillinger** (viser ekstra tekst).
- Brugere kan til enhver tid genåbne banneret via knappen “Cookieindstillinger” i footeren.

## Formularer
- Der er to formularer på `contact.html`: tilbudsformular (`#quote`) og kontaktformular (`#contact-form`).
- Klientvalidering sikrer, at obligatoriske felter er udfyldt og at e-mailadresser er gyldige.
- Ved succes danner JavaScript et `mailto:`-link til `info@dingulvmand.dk`, så henvendelsen åbner i brugerens e-mailklient.

## Tilpasning
- Primære farver og spacing findes øverst i `assets/css/styles.css` som CSS-variabler.
- Tekster kan redigeres direkte i HTML-filerne (alle tekster er på dansk).
- JSON-LD schema markup er inkluderet på alle sider og kan udvides ved behov.

## Licens
Projektet er leveret som kundespecifikt arbejde og kan frit videreudvikles af Din gulvmand v/Nikolaj Nyhuus og deres samarbejdspartnere.

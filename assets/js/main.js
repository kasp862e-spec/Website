// Global funktionalitet for Din gulvmand v/Nikolaj Nyhuus
(function () {
  const doc = document;
  const navToggle = doc.querySelector('.site-header__toggle');
  const nav = doc.querySelector('.site-header__nav');
  const footerYear = doc.querySelector('#copyright');
  const cookieBanner = doc.querySelector('.cookie-banner');
  const cookieAccept = doc.querySelector('[data-cookie-accept]');
  const cookieDecline = doc.querySelector('[data-cookie-decline]');
  const cookieSettingsToggle = doc.querySelector('[data-cookie-settings-toggle]');
  const cookieSettingsButton = doc.querySelector('[data-cookie-settings]');
  const cookieDetails = doc.querySelector('.cookie-banner__details');
  const GA_ID = 'GA_MEASUREMENT_ID'; // Udskift med faktisk GA4-id
  const CONSENT_KEY = 'dg_cookie_consent';

  const toggleNav = () => {
    if (!nav || !navToggle) return;
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  };

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  doc.addEventListener('click', event => {
    if (!nav || !navToggle) return;
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
      if (nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  if (footerYear) {
    const year = new Date().getFullYear();
    footerYear.textContent = `\u00A9 ${year} Din gulvmand v/Nikolaj Nyhuus`;
  }

  const loadAnalytics = () => {
    if (!GA_ID || GA_ID === 'GA_MEASUREMENT_ID') return;
    if (doc.querySelector('script[data-analytics]')) return;

    const script = doc.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    script.dataset.analytics = 'true';
    doc.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  };

  const setConsent = value => {
    localStorage.setItem(CONSENT_KEY, value);
  };

  const handleConsent = value => {
    if (!cookieBanner) return;
    if (value === 'accept') {
      setConsent('accept');
      cookieBanner.setAttribute('hidden', '');
      loadAnalytics();
    } else if (value === 'decline') {
      setConsent('decline');
      cookieBanner.setAttribute('hidden', '');
    }
  };

  const showBanner = () => {
    cookieBanner?.removeAttribute('hidden');
    if (cookieDetails) {
      cookieDetails.setAttribute('hidden', '');
    }
  };

  const storedConsent = localStorage.getItem(CONSENT_KEY);
  if (!storedConsent) {
    showBanner();
  } else if (storedConsent === 'accept') {
    loadAnalytics();
  }

  cookieAccept?.addEventListener('click', () => handleConsent('accept'));
  cookieDecline?.addEventListener('click', () => handleConsent('decline'));
  cookieSettingsToggle?.addEventListener('click', () => {
    if (!cookieDetails) return;
    const isHidden = cookieDetails.hasAttribute('hidden');
    if (isHidden) {
      cookieDetails.removeAttribute('hidden');
    } else {
      cookieDetails.setAttribute('hidden', '');
    }
  });
  cookieSettingsButton?.addEventListener('click', showBanner);

  const forms = [
    {
      id: 'quote',
      fields: {
        name: { required: true },
        email: { required: true, email: true },
        phone: {},
        type: {},
        area: { number: true },
        city: {},
        message: { required: true }
      },
      subject: 'Tilbudsanmodning',
      formatter: data =>
        `Navn: ${data.name || ''}%0D` +
        `E-mail: ${data.email || ''}%0D` +
        `Telefon: ${data.phone || ''}%0D` +
        `Opgavetype: ${data.type || ''}%0D` +
        `Areal: ${data.area || ''}%0D` +
        `By: ${data.city || ''}%0D` +
        `Besked:%0D${data.message || ''}`
    },
    {
      id: 'contact-form',
      fields: {
        name: { required: true },
        email: { required: true, email: true },
        message: { required: true }
      },
      subject: 'Kontaktbesked',
      formatter: data =>
        `Navn: ${data.name || ''}%0D` +
        `E-mail: ${data.email || ''}%0D` +
        `Besked:%0D${data.message || ''}`
    }
  ];

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, rule) => {
    const errorEl = doc.querySelector(`#${input.id}-error`);
    let message = '';
    const value = input.value.trim();

    if (rule.required && !value) {
      message = 'Dette felt er påkrævet.';
    } else if (rule.email && value && !emailPattern.test(value)) {
      message = 'Angiv en gyldig e-mailadresse.';
    } else if (rule.number && value) {
      const numberValue = Number(value);
      if (Number.isNaN(numberValue) || numberValue < 0) {
        message = 'Angiv et gyldigt tal.';
      }
    }

    if (errorEl) {
      errorEl.textContent = message;
    }
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  };

  forms.forEach(config => {
    const form = doc.getElementById(config.id);
    if (!form) return;

    form.addEventListener('submit', event => {
      event.preventDefault();
      const values = {};
      let isValid = true;

      Object.entries(config.fields).forEach(([name, rule]) => {
        const input = form.querySelector(`[name="${name}"]`);
        if (!input) return;
        if (rule) {
          const valid = validateField(input, rule);
          if (!valid) {
            isValid = false;
          }
        }
        values[name] = input.value.trim();
      });

      if (!isValid) return;

      const body = config.formatter(values);
      const subject = `${config.subject} - Din gulvmand`;
      const mailto = `mailto:info@dingulvmand.dk?subject=${encodeURIComponent(subject)}&body=${body}`;
      window.location.href = mailto;
      form.reset();
    });

    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => {
        const rule = config.fields[field.name];
        if (rule) {
          validateField(field, rule);
        }
      });
    });
  });
})();

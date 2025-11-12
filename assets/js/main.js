const NAVIGATION = [
  { label: "Forside", href: "index.html" },
  { label: "Om os", href: "om-os.html" },
  { label: "Ydelser", href: "ydelser.html" },
  { label: "Kontakt", href: "kontakt.html" }
];

const SERVICE_LISTINGS = window.SERVICES || [];

function initNavigation() {
  const navLists = document.querySelectorAll('[data-nav-list]');
  navLists.forEach((list) => {
    list.innerHTML = NAVIGATION.map((item) => {
      const isActive = window.location.pathname.endsWith(item.href);
      const activeClass = isActive ? 'class="active"' : '';
      return `<li><a ${activeClass} href="${item.href}">${item.label}</a></li>`;
    }).join('');
  });

  const navSelect = document.querySelector('[data-nav-select]');
  if (navSelect) {
    navSelect.innerHTML = NAVIGATION.map((item) => {
      const isActive = window.location.pathname.endsWith(item.href) ||
        (item.href === 'index.html' && (window.location.pathname.endsWith('/') || window.location.pathname === ''));
      return `<option value="${item.href}" ${isActive ? 'selected' : ''}>${item.label}</option>`;
    }).join('');

    navSelect.addEventListener('change', (event) => {
      window.location.href = event.target.value;
    });
  }
}

function initForms() {
  const forms = document.querySelectorAll('form[data-enhanced-form]');
  const RATE_LIMIT_MS = 60000; // 1 minute between submissions

  forms.forEach((form) => {
    const feedback = form.querySelector('[data-feedback]');
    const warning = form.querySelector('[data-rate-warning]');
    const honeypot = form.querySelector('[data-honeypot]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (honeypot && honeypot.value) {
        feedback.textContent = 'Noget gik galt. Kontakt os gerne direkte på telefon.';
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
        return;
      }

      const lastSubmit = Number(localStorage.getItem('din-gulvmand-last-submit') || 0);
      const now = Date.now();
      const diff = now - lastSubmit;
      if (diff < RATE_LIMIT_MS) {
        warning.style.display = 'block';
        warning.textContent = `Du kan sende en ny besked om ${Math.ceil((RATE_LIMIT_MS - diff) / 1000)} sekunder.`;
        return;
      }
      warning.style.display = 'none';

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      console.log('Formular indsendt', payload);

      feedback.textContent = form.dataset.successMessage || 'Tak for din henvendelse! Vi vender tilbage snarest.';
      feedback.className = 'form-feedback success';
      feedback.style.display = 'block';
      form.reset();
      localStorage.setItem('din-gulvmand-last-submit', String(now));
    });
  });
}

function initMobileCallButton() {
  const callButton = document.querySelector('[data-mobile-call]');
  if (!callButton) return;

  const handleScroll = () => {
    if (window.scrollY > 100) {
      callButton.classList.add('visible');
    } else {
      callButton.classList.remove('visible');
    }
  };

  callButton.addEventListener('click', () => {
    gtagCall();
  });

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

function initAnalytics() {
  window.gtagCall = function () {
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'call_click' });
    }
  };

  window.addEventListener('click', (event) => {
    const target = event.target.closest('[data-track]');
    if (!target) return;
    if (window.dataLayer) {
      window.dataLayer.push({ event: target.dataset.track });
    }
  });
}

function renderServiceListings() {
  const teaserContainers = document.querySelectorAll('[data-service-list="teasers"]');
  teaserContainers.forEach((container) => {
    container.innerHTML = SERVICE_LISTINGS.map((service) => `
      <article class="service-card">
        <div class="icon" aria-hidden="true">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.excerpt}</p>
        <a class="btn btn-outline tablet-hidden" href="${service.link}" data-track="service_read_more_${service.id}">Læs mere</a>
      </article>
    `).join('');
  });

  const quickNav = document.querySelector('[data-service-list="quick-nav"]');
  if (quickNav) {
    quickNav.innerHTML = SERVICE_LISTINGS.map((service) => `
      <li><a href="${service.link}">${service.title}</a></li>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initForms();
  initMobileCallButton();
  initAnalytics();
  renderServiceListings();
});

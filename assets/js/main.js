const includePartials = async () => {
  const partialElements = document.querySelectorAll('[data-include]');
  await Promise.all(
    Array.from(partialElements).map(async (el) => {
      const path = el.getAttribute('data-include');
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to load partial: ${path}`);
        }
        const html = await response.text();
        el.innerHTML = html;
      } catch (error) {
        console.error(error);
      }
    })
  );
  document.querySelectorAll('.js-year').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
  attachNavHandlers();
  initAccordions();
  initTabs();
};

const attachNavHandlers = () => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', (!expanded).toString());
    });
  }
};

const initAccordions = () => {
  document.querySelectorAll('.accordion').forEach((accordion) => {
    accordion.querySelectorAll('.accordion-item').forEach((item) => {
      const button = item.querySelector('.accordion-button');
      button?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        accordion.querySelectorAll('.accordion-item').forEach((i) => {
          i.classList.remove('active');
          i.querySelector('.accordion-button')?.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
          item.classList.add('active');
          button?.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
};

const initTabs = () => {
  document.querySelectorAll('[data-tabs]').forEach((tabContainer) => {
    const buttons = tabContainer.querySelectorAll('[role="tab"]');
    const panels = tabContainer.querySelectorAll('[role="tabpanel"]');
    panels.forEach((panel, index) => {
      panel.toggleAttribute('hidden', !panel.classList.contains('active'));
      if (buttons[index]) {
        buttons[index].setAttribute('aria-selected', panel.classList.contains('active') ? 'true' : 'false');
      }
    });
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('aria-controls');
        buttons.forEach((btn) => btn.setAttribute('aria-selected', 'false'));
        panels.forEach((panel) => {
          panel.classList.remove('active');
          panel.setAttribute('hidden', '');
        });
        button.setAttribute('aria-selected', 'true');
        const activePanel = tabContainer.querySelector(`#${target}`);
        if (activePanel) {
          activePanel.classList.add('active');
          activePanel.removeAttribute('hidden');
        }
      });
    });
  });
};

const initForms = () => {
  document.querySelectorAll('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const phoneField = form.querySelector('[name="phone"]');
      const honeypot = form.querySelector('[name="company"]');
      if (honeypot && honeypot.value) {
        event.preventDefault();
        showToast('Din forespørgsel blev markeret som spam. Prøv igen eller ring til os.', true);
        return;
      }
      if (phoneField && phoneField.value && !/^[+0-9\s-]{6,}$/.test(phoneField.value)) {
        event.preventDefault();
        showToast('Angiv venligst et gyldigt telefonnummer.', true);
        phoneField.focus();
      }
    });
  });
};

let toastTimeout;
const showToast = (message, isError = false) => {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
};

document.addEventListener('DOMContentLoaded', async () => {
  await includePartials();
  initForms();
});

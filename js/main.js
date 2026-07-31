/* ═══════════════════════════════════════
   PORTFOLIO — main.js
   Pablo Andrés Muñoz
   ═══════════════════════════════════════ */

/* ═══════════════════════════════════════
   CONFIGURACIÓN
   ═══════════════════════════════════════ */

/* Pega aquí el ID de tu formulario de Formspree (formspree.io → New Form).
   Es el código final de la URL, por ejemplo: 'mabcdefg'.
   Mientras esté vacío el formulario queda inactivo y en su lugar se muestra
   el contacto directo, para que nadie escriba un mensaje que no llegaría. */
const FORMSPREE_ID = '';

const CONTACTO = {
  email:    'ingenieropabloandres0@gmail.com',
  whatsapp: 'https://wa.me/573217476850'
};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTyping();
  initScrollReveal();
  loadData();
  initContactForm();
  setCurrentYear();
});

/* ───── NAV ───── */
function initNav() {
  const nav       = document.getElementById('nav');
  const toggle    = document.getElementById('navToggle');
  const menu      = document.getElementById('navMenu');
  const links     = menu.querySelectorAll('.nav__link');

  // Se consultaba el DOM en cada evento de scroll; basta una vez.
  // Debe declararse antes del primer onScroll(): highlightActiveLink lo lee.
  const sections  = document.querySelectorAll('section[id]');

  // Scroll → glass nav
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  const setMenu = open => {
    toggle.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  setMenu(false);

  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Highlight active section
  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }
}

/* ───── TYPING EFFECT ───── */
function initTyping() {
  const roles = [
    'Ingeniero de Sistemas',
    'Full Stack Developer',
    'Especialista en IA',
    'Ingeniero de Datos e IA',
    'Docente universitario'
  ];

  const el = document.getElementById('typingText');

  // El typing es JS puro, así que la regla CSS de reduced-motion no lo alcanza:
  // hay que detenerlo aquí o el texto parpadea indefinidamente.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = roles[0];
    return;
  }

  let roleIdx    = 0;
  let charIdx    = 0;
  let deleting   = false;
  const typeSpeed   = 70;
  const deleteSpeed = 40;
  const holdTime    = 2200;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; tick(); }, holdTime);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  tick();
}

/* ───── SCROLL REVEAL ─────
   Un único observer compartido. Antes se creaba uno nuevo en cada render y
   en cada clic de filtro, sin desconectar los anteriores. */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // ya cumplió su función
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

/* Observa el propio elemento y/o sus descendientes revelables. */
function observeReveal(scope = document) {
  if (scope.classList?.contains('reveal') || scope.classList?.contains('reveal-stagger')) {
    revealObserver.observe(scope);
  }
  scope.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));
}

function initScrollReveal() {
  observeReveal();
}

/* ───── LOAD DATA ───── */
async function loadData() {
  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderTimeline(data.experience);
    renderProjects(data.projects);
    renderSkills(data.skills);
    renderEducation(data.education);
    renderCertifications(data.certifications);
  } catch (err) {
    console.error('Error loading data:', err);
    showDataError();
  }
}

/* Sin esto, un fallo de red deja cuatro secciones vacías y en silencio:
   el visitante no ve nada y no sabe por qué. */
function showDataError() {
  const sections = {
    timeline:      'la experiencia profesional',
    projectsGrid:  'los proyectos',
    skillsGrid:    'las habilidades',
    educationGrid: 'la formación',
    certsGrid:     'las certificaciones'
  };

  Object.entries(sections).forEach(([id, label]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('reveal-stagger');
    el.innerHTML = `
      <div class="data-error" role="alert">
        <svg class="icon" aria-hidden="true"><use href="#i-triangle-alert"></use></svg>
        <p>No se pudo cargar ${label}.</p>
        <p class="data-error__hint">
          Revisa tu conexión y recarga la página, o escríbeme a
          <a href="mailto:ingenieropabloandres0@gmail.com">ingenieropabloandres0@gmail.com</a>.
        </p>
      </div>`;
  });
}

/* ───── TIMELINE ───── */
function renderTimeline(items) {
  const container = document.getElementById('timeline');
  container.classList.add('reveal-stagger');

  container.innerHTML = items.map(item => `
    <div class="timeline__item">
      <div class="timeline__card glass">
        <span class="timeline__period">${item.period}</span>
        <h3 class="timeline__role">${item.role}</h3>
        <p class="timeline__company">${item.company}</p>
        <p class="timeline__desc">${item.description}</p>
        <ul class="timeline__results">
          ${item.results.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  // Re-observe for scroll reveal
  observeReveal(container);
}

/* ───── PROJECTS ───── */
function renderProjects(projects) {
  const grid    = document.getElementById('projectsGrid');
  const filters = document.getElementById('projectFilters');

  // Build filter buttons
  const categories = [...new Set(projects.map(p => p.category))];
  const categoryLabels = {
    'desarrollo':    'Desarrollo',
    'ia':            'Inteligencia Artificial',
    'ciencia-datos': 'Ciencia de datos',
    'automatizacion':'Automatización'
  };

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.type = 'button';
    btn.dataset.filter = cat;
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = categoryLabels[cat] || cat;
    filters.appendChild(btn);
  });

  // Render all cards
  function renderCards(filter = 'all') {
    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

    grid.innerHTML = filtered.map(p => {
      // Sin captura, el icono sigue haciendo de portada.
      const cover = p.image
        ? `<img src="${p.image}" alt="Captura de ${p.title}" loading="lazy" decoding="async">`
        : `<svg class="icon" aria-hidden="true"><use href="#i-${p.icon}"></use></svg>`;
      const links = p.links || {};

      return `
      <article class="project-card reveal">
        <div class="project-card__img">${cover}</div>
        <div class="project-card__body">
          <span class="project-card__category">${categoryLabels[p.category] || p.category}</span>
          <h3 class="project-card__title">${p.title}</h3>
          ${p.problem ? `<p class="project-card__problem">${p.problem}</p>` : ''}
          <p class="project-card__desc">${p.description}</p>
          ${p.result ? `<p class="project-card__result">${p.result}</p>` : ''}
          <div class="project-card__tags">
            ${p.technologies.map(t => `<span class="project-card__tag">${t}</span>`).join('')}
          </div>
          <div class="project-card__links">
            ${links.repo ? `<a href="${links.repo}" target="_blank" rel="noopener" class="project-card__link"><svg class="icon" aria-hidden="true"><use href="#i-github"></use></svg> Código</a>` : ''}
            ${links.demo ? `<a href="${links.demo}" target="_blank" rel="noopener" class="project-card__link"><svg class="icon" aria-hidden="true"><use href="#i-external-link"></use></svg> Demo</a>` : ''}
          </div>
        </div>
      </article>`;
    }).join('');

    observeReveal(grid);
  }

  renderCards();

  // Filter click handling
  filters.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filters.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    renderCards(btn.dataset.filter);
  });
}

/* ───── SKILLS ───── */
function renderSkills(skills) {
  const grid = document.getElementById('skillsGrid');
  grid.classList.add('reveal-stagger');

  grid.innerHTML = skills.map(group => `
    <div class="skill-group glass">
      <div class="skill-group__icon"><svg class="icon" aria-hidden="true"><use href="#i-${group.icon}"></use></svg></div>
      <h3 class="skill-group__title">${group.category}</h3>
      <div class="skill-group__items">
        ${group.items.map(item =>
          `<span class="skill-badge" data-level="${item.level}" title="${capitalize(item.level)}">${item.name}</span>`
        ).join('')}
      </div>
    </div>
  `).join('');

  observeReveal(grid);
}

/* ───── EDUCATION ───── */
function renderEducation(items) {
  const grid = document.getElementById('educationGrid');
  grid.classList.add('reveal-stagger');

  grid.innerHTML = items.map(item => `
    <div class="edu-card glass">
      <div class="edu-card__icon"><svg class="icon" aria-hidden="true"><use href="#i-${item.icon}"></use></svg></div>
      <div>
        <h3 class="edu-card__title">${item.title}</h3>
        ${item.institution ? `<p class="edu-card__institution">${item.institution}</p>` : ''}
        <span class="edu-card__status">${item.status}</span>
        ${item.period ? `<span class="edu-card__period">${item.period}</span>` : ''}
      </div>
    </div>
  `).join('');

  observeReveal(grid);
}

/* ───── CERTIFICACIONES ───── */
function renderCertifications(items) {
  const grid = document.getElementById('certsGrid');
  if (!grid || !items) return;
  grid.classList.add('reveal-stagger');

  grid.innerHTML = items.map(item => `
    <div class="cert-card glass">
      <svg class="icon cert-card__icon" aria-hidden="true"><use href="#i-${item.icon}"></use></svg>
      <div>
        <h4 class="cert-card__title">${item.title}</h4>
        ${item.issuer ? `<p class="cert-card__issuer">${item.issuer}</p>` : ''}
      </div>
    </div>
  `).join('');

  observeReveal(grid);
}

/* ───── FORMULARIO DE CONTACTO ───── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const notice = document.createElement('div');
  notice.className = 'form-notice';
  form.prepend(notice);

  // Sin ID configurado: desactivamos el formulario en vez de fingir que envía.
  if (!FORMSPREE_ID) {
    notice.classList.add('form-notice--info');
    notice.setAttribute('role', 'status');
    notice.innerHTML = `
      <svg class="icon" aria-hidden="true"><use href="#i-info"></use></svg>
      <div>
        <strong>El formulario todavía no está conectado.</strong>
        <p>
          Escríbeme a <a href="mailto:${CONTACTO.email}">${CONTACTO.email}</a>
          o por <a href="${CONTACTO.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>.
        </p>
      </div>`;
    form.querySelectorAll('input, textarea, button').forEach(el => {
      el.disabled = true;
    });
    return;
  }

  notice.hidden = true;
  form.action = `https://formspree.io/f/${FORMSPREE_ID}`;

  const showNotice = (type, html) => {
    notice.hidden = false;
    notice.className = `form-notice form-notice--${type}`;
    notice.setAttribute('role', type === 'error' ? 'alert' : 'status');
    notice.innerHTML = html;
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showNotice('success', '<svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg><div>¡Mensaje enviado! Te responderé pronto.</div>');
      form.reset();
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
      showNotice('error', `
        <svg class="icon" aria-hidden="true"><use href="#i-triangle-alert"></use></svg>
        <div>No se pudo enviar. Escríbeme a
          <a href="mailto:${CONTACTO.email}">${CONTACTO.email}</a>.
        </div>`);
    } finally {
      btn.disabled = false;
      btn.innerHTML = label;
    }
  });
}

/* ───── UTILS ───── */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function setCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}
